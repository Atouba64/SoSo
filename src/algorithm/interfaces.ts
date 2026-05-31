export interface User {
    id: string;
    kycVerified: boolean;
    creditScore: number;
    historicalSuccessRate: number; // 0 to 1
    totalCollateralStaked: number;
    defaulted: boolean;
}

export interface Group {
    id: string;
    members: User[];
    cycleAmount: number;
    rotationMode: 'FIXED' | 'BIDDING' | 'LOTTERY' | 'GUARANTOR';
    solidarityFundActive: boolean;
    solidarityFundBalance: number;
    liquidityBufferUsed: number;
    currentCycle: number;
    totalCycles: number;
}

export interface Bid {
    userId: string;
    discountOffered: number; // The amount they are willing to give up to get the pot now
}

export interface PayoutResult {
    winnerId: string;
    payoutAmount: number;
    dividendPerMember?: number;
    solidarityContribution?: number;
}