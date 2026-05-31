import { Group, User, Bid, PayoutResult } from './interfaces';

export class RotationEngine {
    
    /**
     * Executes a cycle payout based on the group's cultural rotation mode.
     */
    public static executeCycle(group: Group, bids: Bid[] = [], eligibleLotteryMembers: string[] = []): PayoutResult {
        const basePot = group.cycleAmount * group.members.length;
        let solidarityFee = 0;

        // 1. Digital Solidarity Fund (Caisse de Solidarité)
        // Deduct a tiny percentage (e.g., 2%) for the emergency vault if active
        if (group.solidarityFundActive) {
            solidarityFee = basePot * 0.02;
            group.solidarityFundBalance += solidarityFee;
        }

        const availablePot = basePot - solidarityFee;

        // 2. Process based on cultural rotation mechanics
        switch (group.rotationMode) {
            
            case 'BIDDING':
                // Bamileke Tontine / Indian Chit Fund logic
                return this.processBiddingAuction(group, availablePot, bids, solidarityFee);
                
            case 'LOTTERY':
                // Indonesian Arisan logic
                return this.processLottery(group, availablePot, eligibleLotteryMembers, solidarityFee);
                
            case 'GUARANTOR':
                // Chinese Hui logic
                return this.processGuarantor(group, availablePot, solidarityFee);
                
            case 'FIXED':
            default:
                // Standard Likelemba / Susu logic
                return this.processFixedSchedule(group, availablePot, solidarityFee);
        }
    }

    private static processBiddingAuction(group: Group, availablePot: number, bids: Bid[], solidarityFee: number): PayoutResult {
        if (bids.length === 0) throw new Error("Bidding mode requires bids");

        // Find the highest bidder (the person willing to take the largest discount/pay most interest)
        const winningBid = bids.reduce((prev, current) => 
            (prev.discountOffered > current.discountOffered) ? prev : current
        );

        // Calculate dividend to be distributed to the other members
        const dividendPerMember = winningBid.discountOffered / (group.members.length - 1);
        const finalPayout = availablePot - winningBid.discountOffered;

        return {
            winnerId: winningBid.userId,
            payoutAmount: finalPayout,
            dividendPerMember: dividendPerMember,
            solidarityContribution: solidarityFee
        };
    }

    private static processLottery(group: Group, availablePot: number, eligibleMembers: string[], solidarityFee: number): PayoutResult {
        if (eligibleMembers.length === 0) throw new Error("No eligible members for lottery");

        // Cryptographically secure random selection (provably fair)
        // Simulated here with Math.random for demonstration
        const randomIndex = Math.floor(Math.random() * eligibleMembers.length);
        const winnerId = eligibleMembers[randomIndex];

        return {
            winnerId,
            payoutAmount: availablePot,
            solidarityContribution: solidarityFee
        };
    }

    private static processGuarantor(group: Group, availablePot: number, solidarityFee: number): PayoutResult {
        // In Hui systems, the creator/guarantor ALWAYS gets the first pot without bidding
        // For subsequent cycles, it switches to bidding or fixed. (Simplified here)
        const guarantor = group.members[0]; // Assuming creator is at index 0
        
        return {
            winnerId: guarantor.id,
            payoutAmount: availablePot, // No interest deducted for the guarantor
            solidarityContribution: solidarityFee
        };
    }

    private static processFixedSchedule(group: Group, availablePot: number, solidarityFee: number): PayoutResult {
        // Simple queue rotation based on the current cycle number
        const winner = group.members[group.currentCycle - 1];

        return {
            winnerId: winner.id,
            payoutAmount: availablePot,
            solidarityContribution: solidarityFee
        };
    }
}