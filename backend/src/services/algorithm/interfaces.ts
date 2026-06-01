export interface User {
  id: string;
  kycVerified: boolean;
  creditScore: number;
  historicalSuccessRate: number;
  totalCollateralStaked: number;
  defaulted: boolean;
}

export interface Bid {
  userId: string;
  discountOffered: number;
}

export interface CycleFees {
  solidarityContribution: number;
  loanPoolContribution: number;
  foremanFee: number;
  collectorFee: number;
  totalDeductedFromPot: number;
}

export interface PayoutResult {
  winnerId: string;
  payoutAmount: number;
  payoutType: 'CASH' | 'GOAL';
  goalDescription?: string;
  dividendPerMember?: number;
  fees: CycleFees;
  /** Accumulating pool: no winner yet */
  deferred?: boolean;
  accumulatedBalance?: number;
  message?: string;
}

export interface LoanRequest {
  userId: string;
  amount: number;
  termWeeks: number;
}

export interface LoanApproval {
  approved: boolean;
  loanId?: string;
  interestRate: number;
  reason?: string;
}

export interface SolidarityDisbursementRequest {
  beneficiaryUserId: string;
  amount: number;
  reason: string;
  voteYesCount: number;
  voteNoCount: number;
  quorumRequired: number;
}