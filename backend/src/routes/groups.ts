import { Router, Request, Response } from 'express';
import { PrismaClient, CulturalPreset } from '@prisma/client';
import { SoSoEngine } from '../services/algorithm/SoSoEngine';
import { prismaGroupToConfig, applyPreset, GroupWithMembers } from '../services/groupMapper';
import { GROUP_PRESETS } from '../services/algorithm/GroupConfig';

export function createGroupRoutes(prisma: PrismaClient): Router {
  const router = Router();

  router.get('/presets', (_req: Request, res: Response) => {
    res.json({
      presets: Object.keys(GROUP_PRESETS).map((key) => ({
        id: key,
        ...GROUP_PRESETS[key as keyof typeof GROUP_PRESETS],
      })),
      unifiedModel: '/docs/UNIFIED_ROSCA_MODEL.md',
    });
  });

  router.get('/:groupId', async (req: Request, res: Response) => {
    try {
      const groupId = String(req.params.groupId);
      const group = (await prisma.group.findUnique({
        where: { id: groupId },
        include: { members: { include: { user: true } } },
      })) as GroupWithMembers | null;
      if (!group) return res.status(404).json({ error: 'Group not found' });
      res.json({ group, config: prismaGroupToConfig(group) });
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });

  router.post('/', async (req: Request, res: Response) => {
    try {
      const {
        name,
        cycleAmount,
        totalCycles,
        culturalPreset,
        payoutSelection,
        poolStructure,
        purpose,
        payoutType,
        goalDescription,
        targetPoolAmount,
        creatorUserId,
      } = req.body;

      const presetData =
        culturalPreset && culturalPreset in GROUP_PRESETS
          ? applyPreset(culturalPreset as CulturalPreset)
          : {};

      const group = (await prisma.group.create({
        data: {
          name,
          cycleAmount,
          totalCycles,
          ...presetData,
          ...(payoutSelection && { payoutSelection }),
          ...(poolStructure && { poolStructure }),
          ...(purpose && { purpose }),
          ...(payoutType && { payoutType }),
          ...(goalDescription && { goalDescription }),
          ...(targetPoolAmount != null && { targetPoolAmount }),
          members: {
            create: {
              userId: creatorUserId,
              role: 'CREATOR',
            },
          },
        },
        include: { members: { include: { user: true } } },
      })) as GroupWithMembers;

      const config = prismaGroupToConfig(group);
      config.rotationOrder = SoSoEngine.buildRotationOrder(config);
      await prisma.group.update({
        where: { id: group.id },
        data: { rotationOrder: config.rotationOrder },
      });

      res.status(201).json({ group, config });
    } catch (e) {
      res.status(400).json({ error: String(e) });
    }
  });

  router.post('/:groupId/cycles/execute', async (req: Request, res: Response) => {
    try {
      const groupId = String(req.params.groupId);
      const group = (await prisma.group.findUnique({
        where: { id: groupId },
        include: { members: { include: { user: true } } },
      })) as GroupWithMembers | null;
      if (!group) return res.status(404).json({ error: 'Group not found' });

      const config = prismaGroupToConfig(group);
      const bids = (req.body.bids ?? []).map((b: { userId: string; discountOffered: number }) => ({
        userId: b.userId,
        discountOffered: b.discountOffered,
      }));

      const result = SoSoEngine.executeCycle(config, bids, req.body.lotterySeed);

      await prisma.group.update({
        where: { id: group.id },
        data: {
          currentCycle: config.currentCycle,
          solidarityFundBalance: config.solidarityFundBalance,
          loanPoolBalance: config.loanPoolBalance,
          accumulatedBalance: config.accumulatedBalance,
          membersWhoReceivedPot: config.membersWhoReceivedPot,
          liquidityBufferUsed: config.liquidityBufferUsed,
        },
      });

      res.json({ result, groupState: config });
    } catch (e) {
      res.status(400).json({ error: String(e) });
    }
  });

  router.post('/:groupId/loans', async (req: Request, res: Response) => {
    try {
      const groupId = String(req.params.groupId);
      const group = (await prisma.group.findUnique({
        where: { id: groupId },
        include: { members: { include: { user: true } } },
      })) as GroupWithMembers | null;
      if (!group) return res.status(404).json({ error: 'Group not found' });

      const config = prismaGroupToConfig(group);
      const approval = SoSoEngine.requestLoan(config, {
        userId: req.body.userId,
        amount: req.body.amount,
        termWeeks: req.body.termWeeks ?? 4,
      });

      if (approval.approved && approval.loanId) {
        await prisma.internalLoan.create({
          data: {
            id: approval.loanId,
            groupId: group.id,
            userId: req.body.userId,
            amount: req.body.amount,
            interestRate: approval.interestRate,
            termWeeks: req.body.termWeeks ?? 4,
          },
        });
        await prisma.group.update({
          where: { id: group.id },
          data: { loanPoolBalance: config.loanPoolBalance },
        });
      }

      res.json({ approval, loanPoolBalance: config.loanPoolBalance });
    } catch (e) {
      res.status(400).json({ error: String(e) });
    }
  });

  router.post('/:groupId/solidarity/disburse', async (req: Request, res: Response) => {
    try {
      const groupId = String(req.params.groupId);
      const group = (await prisma.group.findUnique({
        where: { id: groupId },
        include: { members: { include: { user: true } } },
      })) as GroupWithMembers | null;
      if (!group) return res.status(404).json({ error: 'Group not found' });

      const config = prismaGroupToConfig(group);
      const memberCount = group.members.length;
      const quorum = Math.ceil(memberCount * 0.5);

      const outcome = SoSoEngine.processSolidarityVote(config, {
        beneficiaryUserId: req.body.beneficiaryUserId,
        amount: req.body.amount,
        reason: req.body.reason,
        voteYesCount: req.body.voteYesCount ?? memberCount,
        voteNoCount: req.body.voteNoCount ?? 0,
        quorumRequired: quorum,
      });

      if (outcome.approved) {
        await prisma.group.update({
          where: { id: group.id },
          data: { solidarityFundBalance: config.solidarityFundBalance },
        });
      }

      res.json({ ...outcome, solidarityFundBalance: config.solidarityFundBalance });
    } catch (e) {
      res.status(400).json({ error: String(e) });
    }
  });

  router.post('/:groupId/late-payment/cover', async (req: Request, res: Response) => {
    try {
      const groupId = String(req.params.groupId);
      const group = (await prisma.group.findUnique({
        where: { id: groupId },
        include: { members: { include: { user: true } } },
      })) as GroupWithMembers | null;
      if (!group) return res.status(404).json({ error: 'Group not found' });

      const config = prismaGroupToConfig(group);
      const result = SoSoEngine.coverLatePayment(
        config,
        req.body.userId,
        req.body.amount
      );

      await prisma.group.update({
        where: { id: group.id },
        data: {
          liquidityBufferUsed: config.liquidityBufferUsed,
          solidarityFundBalance: config.solidarityFundBalance,
        },
      });

      res.json(result);
    } catch (e) {
      res.status(400).json({ error: String(e) });
    }
  });

  return router;
}