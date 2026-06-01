import { TrustEngine } from './TrustEngine';
import { GroupConfig, PayoutSelection } from './GroupConfig';
import { Bid, PayoutResult, CycleFees, LoanRequest, LoanApproval, SolidarityDisbursementRequest } from './interfaces';
import crypto from 'crypto';

/**
 * Unified engine: one core ROSCA + composable cultural add-ons.
 * Replaces separate FIXED/BIDDING/LOTTERY/GUARANTOR enums with payoutSelection + addons.
 */
export class SoSoEngine {
  /**
   * Run one cycle: collect fees, route to loan/solidarity reserves, pick winner or accumulate.
   */
  public static executeCycle(
    group: GroupConfig,
    bids: Bid[] = [],
    lotterySeed?: string
  ): PayoutResult {
    const memberCount = group.members.length;
    const grossPot = group.cycleAmount * memberCount;
    const fees = this.calculateCycleFees(group, grossPot);
    const netPot = grossPot - fees.totalDeductedFromPot;

    this.applyFeesToBalances(group, fees);

    if (group.poolStructure === 'ACCUMULATING') {
      return this.processAccumulating(group, netPot, fees);
    }

    const winnerId = this.selectWinner(group, netPot, bids, lotterySeed);
    const payoutAmount = this.finalizeWinnerPayout(group, netPot, winnerId, bids);

    if (!group.membersWhoReceivedPot.includes(winnerId)) {
      group.membersWhoReceivedPot.push(winnerId);
    }
    group.currentCycle += 1;

    const dividendPerMember = this.calculateDividend(group, bids, winnerId);

    return {
      winnerId,
      payoutAmount,
      payoutType: group.payoutType,
      goalDescription: group.payoutType === 'GOAL' ? group.goalDescription : undefined,
      dividendPerMember,
      fees,
      message: this.buildPayoutMessage(group, winnerId),
    };
  }

  private static calculateCycleFees(group: GroupConfig, grossPot: number): CycleFees {
    const { addons } = group;
    let solidarityContribution = 0;
    let loanPoolContribution = 0;
    let foremanFee = 0;
    let collectorFee = 0;

    if (addons.solidarityFund) {
      solidarityContribution = grossPot * addons.solidarityFundRate;
    }
    if (addons.loanPool) {
      loanPoolContribution = grossPot * addons.loanPoolReserveRate;
    }
    if (addons.foremanFee) {
      foremanFee = grossPot * addons.foremanFeeRate;
    }
    if (addons.collectorFee) {
      collectorFee = group.cycleAmount * addons.collectorFeeDays;
    }

    return {
      solidarityContribution,
      loanPoolContribution,
      foremanFee,
      collectorFee,
      totalDeductedFromPot:
        solidarityContribution + loanPoolContribution + foremanFee + collectorFee,
    };
  }

  private static applyFeesToBalances(group: GroupConfig, fees: CycleFees): void {
    group.solidarityFundBalance += fees.solidarityContribution;
    group.loanPoolBalance += fees.loanPoolContribution;
  }

  private static processAccumulating(
    group: GroupConfig,
    netContribution: number,
    fees: CycleFees
  ): PayoutResult {
    group.accumulatedBalance += netContribution;
    const target = group.targetPoolAmount ?? group.cycleAmount * group.members.length * group.totalCycles;

    if (group.accumulatedBalance < target) {
      group.currentCycle += 1;
      return {
        winnerId: '',
        payoutAmount: 0,
        payoutType: group.payoutType,
        fees,
        deferred: true,
        accumulatedBalance: group.accumulatedBalance,
        message: `Stokvel/Chama mode: ${group.accumulatedBalance.toFixed(2)} / ${target.toFixed(2)} accumulated.`,
      };
    }

    const winnerId = group.rotationOrder[0] ?? group.members[0]?.id ?? '';
    const payout = group.accumulatedBalance;
    group.accumulatedBalance = 0;
    group.currentCycle += 1;

    return {
      winnerId,
      payoutAmount: payout,
      payoutType: group.payoutType,
      fees,
      message: 'Target reached — group payout released.',
    };
  }

  private static selectWinner(
    group: GroupConfig,
    netPot: number,
    bids: Bid[],
    lotterySeed?: string
  ): string {
    if (group.addons.guarantorFirstPot && group.currentCycle === 1 && group.addons.guarantorUserId) {
      return group.addons.guarantorUserId;
    }

    const selection = this.effectivePayoutSelection(group);

    switch (selection) {
      case 'AUCTION':
        return this.selectAuctionWinner(group, bids);
      case 'LOTTERY':
        return this.selectLotteryWinner(group, lotterySeed);
      case 'FIXED_ORDER':
      default:
        return this.selectFixedOrderWinner(group);
    }
  }

  private static effectivePayoutSelection(group: GroupConfig): PayoutSelection {
    return group.payoutSelection;
  }

  private static selectAuctionWinner(group: GroupConfig, bids: Bid[]): string {
    const eligible = group.members.filter(
      (m) => !group.membersWhoReceivedPot.includes(m.id) && !m.defaulted
    );
    const eligibleBids = bids.filter((b) => eligible.some((m) => m.id === b.userId));
    if (eligibleBids.length === 0) {
      throw new Error('Auction mode requires at least one bid from an eligible member');
    }
    const winning = eligibleBids.reduce((a, b) =>
      b.discountOffered > a.discountOffered ? b : a
    );
    return winning.userId;
  }

  private static selectLotteryWinner(group: GroupConfig, seed?: string): string {
    const eligible = group.members
      .filter((m) => !group.membersWhoReceivedPot.includes(m.id) && !m.defaulted)
      .map((m) => m.id);
    if (eligible.length === 0) {
      throw new Error('No eligible members for lottery');
    }
    const hash = crypto
      .createHash('sha256')
      .update(`${seed ?? Date.now()}-${group.id}-${group.currentCycle}`)
      .digest();
    const index = hash.readUInt32BE(0) % eligible.length;
    return eligible[index];
  }

  private static selectFixedOrderWinner(group: GroupConfig): string {
    const order =
      group.rotationOrder.length > 0
        ? group.rotationOrder
        : TrustEngine.generateRiskAdjustedRotation(group.members).map((m) => m.id);

    for (const userId of order) {
      if (!group.membersWhoReceivedPot.includes(userId)) {
        const member = group.members.find((m) => m.id === userId);
        if (member && !member.defaulted) return userId;
      }
    }
    throw new Error('All members have received the pot for this round');
  }

  private static finalizeWinnerPayout(
    group: GroupConfig,
    netPot: number,
    winnerId: string,
    bids: Bid[]
  ): number {
    if (group.payoutSelection === 'AUCTION') {
      const bid = bids.find((b) => b.userId === winnerId);
      return netPot - (bid?.discountOffered ?? 0);
    }
    return netPot;
  }

  private static calculateDividend(
    group: GroupConfig,
    bids: Bid[],
    winnerId: string
  ): number | undefined {
    if (group.payoutSelection !== 'AUCTION') return undefined;
    const bid = bids.find((b) => b.userId === winnerId);
    if (!bid) return undefined;
    const others = group.members.length - 1;
    return others > 0 ? bid.discountOffered / others : 0;
  }

  private static buildPayoutMessage(group: GroupConfig, winnerId: string): string {
    const purpose = group.purpose !== 'GENERAL' ? ` (${group.purpose})` : '';
    if (group.payoutType === 'GOAL') {
      return `Goal payout${purpose}: ${group.goalDescription ?? 'item'} assigned to winner.`;
    }
    return `Cycle ${group.currentCycle} payout${purpose} processed.`;
  }

  /** Bamileke loan pool — short-term liquidity from internal reserve */
  public static requestLoan(group: GroupConfig, request: LoanRequest): LoanApproval {
    if (!group.addons.loanPool) {
      return { approved: false, interestRate: 0, reason: 'Loan pool not enabled for this group' };
    }
    if (request.amount > group.loanPoolBalance) {
      return { approved: false, interestRate: 0, reason: 'Insufficient loan pool balance' };
    }
    const member = group.members.find((m) => m.id === request.userId);
    if (!member || TrustEngine.calculateTrustScore(member) < 400) {
      return { approved: false, interestRate: 0, reason: 'Trust score too low for internal loan' };
    }
    const interestRate = 0.05 + request.termWeeks * 0.01;
    group.loanPoolBalance -= request.amount;
    return {
      approved: true,
      loanId: crypto.randomUUID(),
      interestRate,
    };
  }

  /** Solidarity fund disbursement — group vote */
  public static processSolidarityVote(
    group: GroupConfig,
    request: SolidarityDisbursementRequest
  ): { approved: boolean; reason?: string } {
    if (!group.addons.solidarityFund) {
      return { approved: false, reason: 'Solidarity fund not active' };
    }
    const totalVotes = request.voteYesCount + request.voteNoCount;
    if (totalVotes < request.quorumRequired) {
      return { approved: false, reason: 'Quorum not met' };
    }
    if (request.voteYesCount <= request.voteNoCount) {
      return { approved: false, reason: 'Disbursement rejected by vote' };
    }
    if (request.amount > group.solidarityFundBalance) {
      return { approved: false, reason: 'Insufficient solidarity balance' };
    }
    group.solidarityFundBalance -= request.amount;
    return { approved: true };
  }

  /** Late payment — liquidity buffer + optional penalty */
  public static coverLatePayment(
    group: GroupConfig,
    userId: string,
    amount: number
  ): { covered: boolean; penaltyApplied: number } {
    group.liquidityBufferUsed += amount;
    let penaltyApplied = 0;
    if (group.addons.penaltiesEnabled) {
      penaltyApplied = group.addons.latePenaltyAmount;
      group.solidarityFundBalance += penaltyApplied;
    }
    return { covered: true, penaltyApplied };
  }

  public static buildRotationOrder(group: GroupConfig): string[] {
    return TrustEngine.generateRiskAdjustedRotation(group.members).map((m) => m.id);
  }
}