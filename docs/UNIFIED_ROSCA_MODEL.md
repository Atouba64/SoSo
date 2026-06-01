# SoSo Unified ROSCA Model

Traditional names differ by country (Likelemba, Tontine, Stokvel, Susu, Chit Fund, Hui, Arisan), but they share one idea: **trusted people contribute on a schedule until someone receives a lump sum**. SoSo models that once, then layers optional cultural add-ons.

## Core (every group)

| Concept | What it does |
|--------|----------------|
| **Contributions** | Fixed amount per member each cycle |
| **Escrow** | Funds held by algorithm, not a person |
| **Trust score** | KYC, history, collateral → payout order & eligibility |
| **Liquidity buffer** | Late payers covered; rotation does not stall |

## 1. How the winner is chosen (pick one)

| Mode | Traditions | Behavior |
|------|------------|----------|
| **Fixed order** | Likelemba, basic Susu/Chama | Queue by schedule; low-trust members go last |
| **Auction** | Bamileke tontine, Indian chit | Members bid a discount; highest discount wins pot; rest get dividend |
| **Lottery** | Indonesian Arisan | Provably fair random draw among members who have not yet received |

**Hui / guarantor head** is not a fourth mode: it is **“guarantor receives cycle 1”** on top of fixed, auction, or lottery from cycle 2 onward.

## 2. How the pool behaves (pick one)

| Structure | Traditions | Behavior |
|-----------|------------|----------|
| **Rotating** | Most ROSCAs | Each cycle one member receives the pot |
| **Accumulating** | Stokvel grocery/investment, formal Chama | Pot grows until target or date; then payout or group vote |

## 3. Schedule

| Frequency | Traditions |
|-----------|------------|
| Daily | Susu collector routes |
| Weekly / Monthly | Likelemba, tontine, most groups |

## 4. Composable add-ons (any combination)

| Add-on | Traditions | Behavior |
|--------|------------|----------|
| **Solidarity fund** | Bamileke *caisse de solidarité* | Small % each cycle → emergency vault; group votes to disburse |
| **Loan pool** | Bamileke *caisse de secours* | Reserve % → short-term loans to members (with interest) |
| **Foreman fee** | Chit fund | Organizer commission % (and optional first pot) |
| **Collector fee** | Susu | Equivalent of N days’ contribution per period to organizer |
| **Guarantor first pot** | Chinese Hui | Cycle 1 to staked guarantor; they back defaults |
| **Goal payout** | Arisan barang | Payout as goods/voucher, not cash |
| **Penalties** | Bamileke *censeur* | Automated late/missed-meeting fines to group or solidarity |
| **Group purpose** | Stokvel types | Tags: general, burial, grocery, investment, business, education |

## Presets (shortcuts for users)

| Preset | Payout | Pool | Add-ons |
|--------|--------|------|---------|
| **Classic Likelemba** | Fixed | Rotating | Solidarity optional |
| **Bamileke Tontine** | Auction | Rotating | Solidarity + loan pool + penalties |
| **Chit Fund** | Auction | Rotating | Foreman fee |
| **Hui** | Fixed → auction/fixed | Rotating | Guarantor first pot |
| **Arisan** | Lottery | Rotating | Goal payout optional |
| **Susu** | Fixed | Rotating | Daily schedule + collector fee |
| **Stokvel** | Fixed or vote | Accumulating | Purpose tag |

Implementation lives in `backend/src/services/algorithm/SoSoEngine.ts` and the Prisma `Group` model fields.