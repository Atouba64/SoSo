# Internal Vision & Technical Architecture

## The SoSo Philosophy
SoSo isn't just an app; it is the formalization of a centuries-old cultural practice. We are not trying to teach our users how to save—they already know how to save via Likelemba. We are merely providing them a safer, faster, and borderless vehicle to do so.

## Technical Architecture Overview

### 1. The Frontend (Mobile App)
*   React Native / Flutter for cross-platform availability.
*   Must be incredibly lightweight to function on low-end Android devices prevalent in African markets.
*   UI must be highly intuitive, using visual cues (like the "SoSo" chicken filling up with coins) rather than dense financial jargon.

### 2. The Backend & Trust Engine
*   **Node.js/Python microservices.**
*   **The Trust Algorithm:** This is our core IP. The algorithm calculates a user's "Trust Score" based on:
    *   KYC completion.
    *   Bank account history (via Plaid/Tink).
    *   Historical SoSo rotation success.
    *   Social graph (who they are connected to on the app).
*   **Smart Contracts / Ledger:** Every transaction is recorded on an immutable ledger. Funds are held in automated escrow.
    *   *Note:* Even if we don't use public blockchains (Ethereum/Solana) due to gas fees, we must use a cryptographic ledger (like Hyperledger) to ensure no internal SoSo employee can alter the pot.

### 3. Payment Gateways
*   **Diaspora:** Stripe, Apple Pay, Google Pay, Direct Bank Transfer (Open Banking).
*   **Africa:** Mobile Money APIs (M-Pesa, MTN MoMo, Orange Money, Airtel Money). Flutterwave or Paystack as aggregators.

## The Liquidity Pool (The Safety Net)
The biggest pain point in a Likelemba is when someone doesn't pay. SoSo's Liquidity Pool solves this.
*   If User A misses their $50 payment on Friday, the pot is short.
*   The SoSo Liquidity Pool automatically injects $50 into the pot. User B (the receiver) gets their full payout on time.
*   User A's app locks down. They now owe the SoSo Liquidity Pool $50 + a late fee. We use standard debt collection practices to retrieve this, shielding the rest of the group from the friction.

---

# Internal FAQ & Defensibility (How to Answer Hard Questions)

### Q1: What stops a user from taking the first payout and deleting the app?
**Answer:** Multiple layers of algorithmic friction. 
1. New users are *never* given the first payout slot; the algorithm places them at the end of the rotation until they build a Trust Score.
2. We require KYC and link to their real-world bank account. 
3. If they default, we report them to credit bureaus, ruining their actual credit score. 
4. In extreme cases, they must provide a guarantor (a trusted user) or a collateral deposit.

### Q2: Is this legally a bank? Are you subject to massive banking regulations?
**Answer:** No, we are technically an escrow agent or a payments aggregator, not a bank. We do not lend out user deposits like a fractional reserve bank. The money belongs to the group, we merely facilitate the transfer and hold it in a licensed trust/escrow account. (Note: We will need e-money licenses or partnerships with licensed BaaS providers like SolarisBank or Stripe Treasury).

### Q3: Why wouldn't people just use WhatsApp and CashApp/M-Pesa?
**Answer:** They do, and they get scammed constantly. WhatsApp has no ledger, no automated collection, no dispute resolution, and no liquidity pool to cover late payments. SoSo takes the administrative nightmare out of being the "organizer" and replaces it with guaranteed, automated software.

### Q4: How do you handle currency fluctuations across borders?
**Answer:** If a group spans the UK (GBP) and Congo (CDF), the pot is denominated in a base currency (e.g., USD or a Stablecoin). Users deposit their local equivalent. When it's payout time, the USD value is converted back to the receiver's local currency. This protects African users from local fiat inflation.

### Q5: Why the name "SoSo"?
**Answer:** "SoSo" means chicken in Lingala. Chickens represent small, steady investments (pecking grains) that grow into a valuable asset. They are the original grassroots savings account in rural economies. The repetition "so-so" mimics the rhythmic nature of a rotation. It is authentic, unpretentious, and culturally resonant.