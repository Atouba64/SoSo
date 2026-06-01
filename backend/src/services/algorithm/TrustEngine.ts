import { User } from './interfaces';
import { GroupConfig } from './GroupConfig';

export class TrustEngine {
    /**
     * Calculates a proprietary SoSo Trust Score (0-1000) based on multiple parameters.
     */
    public static calculateTrustScore(user: User): number {
        if (user.defaulted) return 0;
        
        let score = 0;
        
        // KYC is mandatory for a baseline score
        if (user.kycVerified) score += 200;
        
        // Open banking / Credit bureau integration simulation
        score += (user.creditScore * 0.4); // e.g., 700 credit score = 280 points

        // Historical success on the SoSo platform is the strongest indicator
        score += (user.historicalSuccessRate * 400); 

        // Collateral staked (Crypto/Fiat escrow) provides a massive trust boost
        if (user.totalCollateralStaked > 0) {
            score += 120;
        }

        return Math.min(score, 1000);
    }

    /**
     * Determines if a user is eligible to join a specific group based on risk profiling.
     */
    public static isEligibleForGroup(user: User, group: GroupConfig): boolean {
        const trustScore = this.calculateTrustScore(user);

        if (group.addons.guarantorFirstPot && group.addons.guarantorUserId === user.id) {
            return (
                trustScore > 800 ||
                user.totalCollateralStaked >= group.cycleAmount * group.totalCycles
            );
        }

        return trustScore >= 500 && !user.defaulted;
    }

    /**
     * Dynamically orders members for FIXED rotation based on risk.
     * Highest risk members get placed at the end of the rotation.
     */
    public static generateRiskAdjustedRotation(members: User[]): User[] {
        return members.sort((a, b) => this.calculateTrustScore(b) - this.calculateTrustScore(a));
    }
}