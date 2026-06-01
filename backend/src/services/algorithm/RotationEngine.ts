import { GroupConfig, GROUP_PRESETS, defaultAddons } from './GroupConfig';
import { SoSoEngine } from './SoSoEngine';
import { Bid, PayoutResult } from './interfaces';
import { User } from './interfaces';

/**
 * @deprecated Use SoSoEngine + GroupConfig. Kept for backward compatibility.
 */
export class RotationEngine {
  public static executeCycle(
    legacyGroup: {
      id: string;
      members: User[];
      cycleAmount: number;
      rotationMode: 'FIXED' | 'BIDDING' | 'LOTTERY' | 'GUARANTOR';
      solidarityFundActive: boolean;
      solidarityFundBalance: number;
      liquidityBufferUsed: number;
      currentCycle: number;
      totalCycles: number;
    },
    bids: Bid[] = [],
    eligibleLotteryMembers: string[] = []
  ): PayoutResult {
    const modeMap = {
      FIXED: 'FIXED_ORDER' as const,
      BIDDING: 'AUCTION' as const,
      LOTTERY: 'LOTTERY' as const,
      GUARANTOR: 'FIXED_ORDER' as const,
    };

    const config: GroupConfig = {
      id: legacyGroup.id,
      members: legacyGroup.members,
      cycleAmount: legacyGroup.cycleAmount,
      currentCycle: legacyGroup.currentCycle,
      totalCycles: legacyGroup.totalCycles,
      payoutSelection: modeMap[legacyGroup.rotationMode],
      poolStructure: 'ROTATING',
      cycleFrequency: 'MONTHLY',
      purpose: 'GENERAL',
      payoutType: 'CASH',
      accumulatedBalance: 0,
      addons: {
        ...defaultAddons(),
        solidarityFund: legacyGroup.solidarityFundActive,
        guarantorFirstPot: legacyGroup.rotationMode === 'GUARANTOR',
        guarantorUserId: legacyGroup.members[0]?.id,
      },
      solidarityFundBalance: legacyGroup.solidarityFundBalance,
      loanPoolBalance: 0,
      liquidityBufferUsed: legacyGroup.liquidityBufferUsed,
      rotationOrder: SoSoEngine.buildRotationOrder({
        id: legacyGroup.id,
        members: legacyGroup.members,
        cycleAmount: legacyGroup.cycleAmount,
        currentCycle: legacyGroup.currentCycle,
        totalCycles: legacyGroup.totalCycles,
        payoutSelection: modeMap[legacyGroup.rotationMode],
        poolStructure: 'ROTATING',
        cycleFrequency: 'MONTHLY',
        purpose: 'GENERAL',
        payoutType: 'CASH',
        accumulatedBalance: 0,
        addons: defaultAddons(),
        solidarityFundBalance: 0,
        loanPoolBalance: 0,
        liquidityBufferUsed: 0,
        rotationOrder: [],
        membersWhoReceivedPot: [],
      }),
      membersWhoReceivedPot: [],
    };

    if (legacyGroup.rotationMode === 'LOTTERY' && eligibleLotteryMembers.length) {
      config.membersWhoReceivedPot = legacyGroup.members
        .map((m) => m.id)
        .filter((id) => !eligibleLotteryMembers.includes(id));
    }

    return SoSoEngine.executeCycle(config, bids);
  }

  public static getPreset(name: keyof typeof GROUP_PRESETS) {
    return GROUP_PRESETS[name];
  }
}