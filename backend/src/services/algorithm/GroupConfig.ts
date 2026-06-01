import { User } from './interfaces';

/** How the cycle winner is selected */
export type PayoutSelection = 'FIXED_ORDER' | 'AUCTION' | 'LOTTERY';

/** Rotating = one winner per cycle; Accumulating = pool grows until target */
export type PoolStructure = 'ROTATING' | 'ACCUMULATING';

export type CycleFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export type GroupPurpose =
  | 'GENERAL'
  | 'BURIAL'
  | 'GROCERY'
  | 'INVESTMENT'
  | 'BUSINESS'
  | 'EDUCATION';

export type PayoutType = 'CASH' | 'GOAL';

/** Composable cultural add-ons — any subset can be enabled */
export interface GroupAddons {
  solidarityFund: boolean;
  solidarityFundRate: number;
  loanPool: boolean;
  loanPoolReserveRate: number;
  foremanFee: boolean;
  foremanFeeRate: number;
  foremanUserId?: string;
  collectorFee: boolean;
  collectorFeeDays: number;
  guarantorFirstPot: boolean;
  guarantorUserId?: string;
  penaltiesEnabled: boolean;
  latePenaltyAmount: number;
}

export interface GroupConfig {
  id: string;
  members: User[];
  cycleAmount: number;
  currentCycle: number;
  totalCycles: number;

  payoutSelection: PayoutSelection;
  poolStructure: PoolStructure;
  cycleFrequency: CycleFrequency;
  purpose: GroupPurpose;
  payoutType: PayoutType;
  goalDescription?: string;
  targetPoolAmount?: number;
  accumulatedBalance: number;

  addons: GroupAddons;

  solidarityFundBalance: number;
  loanPoolBalance: number;
  liquidityBufferUsed: number;

  /** Fixed-order queue (risk-adjusted user ids) */
  rotationOrder: string[];
  /** Members who already received the pot this round */
  membersWhoReceivedPot: string[];
}

export type CulturalPreset = keyof typeof GROUP_PRESETS;

export const GROUP_PRESETS = {
  LIKELEMBA: {
    payoutSelection: 'FIXED_ORDER',
    poolStructure: 'ROTATING',
    cycleFrequency: 'MONTHLY',
    purpose: 'GENERAL',
    addons: {
      solidarityFund: true,
      solidarityFundRate: 0.02,
      loanPool: false,
      loanPoolReserveRate: 0,
      foremanFee: false,
      foremanFeeRate: 0,
      collectorFee: false,
      collectorFeeDays: 0,
      guarantorFirstPot: false,
      penaltiesEnabled: false,
      latePenaltyAmount: 0,
    },
  },
  BAMILEKE_TONTINE: {
    payoutSelection: 'AUCTION',
    poolStructure: 'ROTATING',
    cycleFrequency: 'MONTHLY',
    purpose: 'BUSINESS',
    addons: {
      solidarityFund: true,
      solidarityFundRate: 0.02,
      loanPool: true,
      loanPoolReserveRate: 0.05,
      foremanFee: false,
      foremanFeeRate: 0,
      collectorFee: false,
      collectorFeeDays: 0,
      guarantorFirstPot: false,
      penaltiesEnabled: true,
      latePenaltyAmount: 10,
    },
  },
  CHIT_FUND: {
    payoutSelection: 'AUCTION',
    poolStructure: 'ROTATING',
    cycleFrequency: 'MONTHLY',
    purpose: 'GENERAL',
    addons: {
      solidarityFund: false,
      solidarityFundRate: 0,
      loanPool: false,
      loanPoolReserveRate: 0,
      foremanFee: true,
      foremanFeeRate: 0.05,
      collectorFee: false,
      collectorFeeDays: 0,
      guarantorFirstPot: false,
      penaltiesEnabled: false,
      latePenaltyAmount: 0,
    },
  },
  HUI: {
    payoutSelection: 'FIXED_ORDER',
    poolStructure: 'ROTATING',
    cycleFrequency: 'MONTHLY',
    purpose: 'BUSINESS',
    addons: {
      solidarityFund: false,
      solidarityFundRate: 0,
      loanPool: false,
      loanPoolReserveRate: 0,
      foremanFee: false,
      foremanFeeRate: 0,
      collectorFee: false,
      collectorFeeDays: 0,
      guarantorFirstPot: true,
      penaltiesEnabled: false,
      latePenaltyAmount: 0,
    },
  },
  ARISAN: {
    payoutSelection: 'LOTTERY',
    poolStructure: 'ROTATING',
    cycleFrequency: 'MONTHLY',
    purpose: 'GENERAL',
    addons: {
      solidarityFund: false,
      solidarityFundRate: 0,
      loanPool: false,
      loanPoolReserveRate: 0,
      foremanFee: false,
      foremanFeeRate: 0,
      collectorFee: false,
      collectorFeeDays: 0,
      guarantorFirstPot: false,
      penaltiesEnabled: false,
      latePenaltyAmount: 0,
    },
  },
  SUSU: {
    payoutSelection: 'FIXED_ORDER',
    poolStructure: 'ROTATING',
    cycleFrequency: 'DAILY',
    purpose: 'GENERAL',
    addons: {
      solidarityFund: false,
      solidarityFundRate: 0,
      loanPool: false,
      loanPoolReserveRate: 0,
      foremanFee: false,
      foremanFeeRate: 0,
      collectorFee: true,
      collectorFeeDays: 1,
      guarantorFirstPot: false,
      penaltiesEnabled: false,
      latePenaltyAmount: 0,
    },
  },
  STOKVEL: {
    payoutSelection: 'FIXED_ORDER',
    poolStructure: 'ACCUMULATING',
    cycleFrequency: 'MONTHLY',
    purpose: 'GROCERY',
    addons: {
      solidarityFund: true,
      solidarityFundRate: 0.01,
      loanPool: false,
      loanPoolReserveRate: 0,
      foremanFee: false,
      foremanFeeRate: 0,
      collectorFee: false,
      collectorFeeDays: 0,
      guarantorFirstPot: false,
      penaltiesEnabled: false,
      latePenaltyAmount: 0,
    },
  },
} as const satisfies Record<
  string,
  Partial<Pick<GroupConfig, 'payoutSelection' | 'poolStructure' | 'cycleFrequency' | 'purpose' | 'addons'>>
>;

export function defaultAddons(): GroupAddons {
  return {
    solidarityFund: false,
    solidarityFundRate: 0.02,
    loanPool: false,
    loanPoolReserveRate: 0.05,
    foremanFee: false,
    foremanFeeRate: 0.05,
    collectorFee: false,
    collectorFeeDays: 1,
    guarantorFirstPot: false,
    penaltiesEnabled: false,
    latePenaltyAmount: 10,
  };
}