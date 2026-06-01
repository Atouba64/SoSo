import { Group as PrismaGroup, GroupMember, User, CulturalPreset } from '@prisma/client';
import { GroupConfig, GROUP_PRESETS, defaultAddons } from './algorithm/GroupConfig';

export type GroupWithMembers = PrismaGroup & {
  members: (GroupMember & { user: User })[];
};

export function prismaGroupToConfig(group: GroupWithMembers): GroupConfig {
  const members = group.members.map((m) => ({
    id: m.user.id,
    kycVerified: m.user.kycVerified,
    creditScore: m.user.creditScore,
    historicalSuccessRate: m.user.historicalSuccessRate,
    totalCollateralStaked: m.user.totalCollateralStaked,
    defaulted: m.user.defaulted,
  }));

  const rotationOrder = Array.isArray(group.rotationOrder)
    ? (group.rotationOrder as string[])
    : members.map((m) => m.id);

  const membersWhoReceivedPot = Array.isArray(group.membersWhoReceivedPot)
    ? (group.membersWhoReceivedPot as string[])
    : [];

  return {
    id: group.id,
    members,
    cycleAmount: group.cycleAmount,
    currentCycle: group.currentCycle,
    totalCycles: group.totalCycles,
    payoutSelection: group.payoutSelection,
    poolStructure: group.poolStructure,
    cycleFrequency: group.cycleFrequency,
    purpose: group.purpose,
    payoutType: group.payoutType,
    goalDescription: group.goalDescription ?? undefined,
    targetPoolAmount: group.targetPoolAmount ?? undefined,
    accumulatedBalance: group.accumulatedBalance,
    addons: {
      solidarityFund: group.solidarityFundActive,
      solidarityFundRate: group.solidarityFundRate,
      loanPool: group.loanPoolActive,
      loanPoolReserveRate: group.loanPoolReserveRate,
      foremanFee: group.foremanFeeActive,
      foremanFeeRate: group.foremanFeeRate,
      foremanUserId: group.foremanUserId ?? undefined,
      collectorFee: group.collectorFeeActive,
      collectorFeeDays: group.collectorFeeDays,
      guarantorFirstPot: group.guarantorFirstPot,
      guarantorUserId: group.guarantorUserId ?? undefined,
      penaltiesEnabled: group.penaltiesEnabled,
      latePenaltyAmount: group.latePenaltyAmount,
    },
    solidarityFundBalance: group.solidarityFundBalance,
    loanPoolBalance: group.loanPoolBalance,
    liquidityBufferUsed: group.liquidityBufferUsed,
    rotationOrder,
    membersWhoReceivedPot,
  };
}

export function applyPreset(preset: CulturalPreset): Record<string, unknown> {
  const key = preset as keyof typeof GROUP_PRESETS;
  const p = GROUP_PRESETS[key];
  if (!p) return { culturalPreset: preset };
  const addons = { ...defaultAddons(), ...p.addons };
  return {
    culturalPreset: preset,
    payoutSelection: p.payoutSelection,
    poolStructure: p.poolStructure,
    cycleFrequency: p.cycleFrequency,
    purpose: p.purpose,
    solidarityFundActive: addons.solidarityFund,
    solidarityFundRate: addons.solidarityFundRate,
    loanPoolActive: addons.loanPool,
    loanPoolReserveRate: addons.loanPoolReserveRate,
    foremanFeeActive: addons.foremanFee,
    foremanFeeRate: addons.foremanFeeRate,
    collectorFeeActive: addons.collectorFee,
    collectorFeeDays: addons.collectorFeeDays,
    guarantorFirstPot: addons.guarantorFirstPot,
    penaltiesEnabled: addons.penaltiesEnabled,
    latePenaltyAmount: addons.latePenaltyAmount,
  };
}