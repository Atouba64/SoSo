# Global ROSCA Research: The Landscape of Trust-Based Savings

> **Implementation:** SoSo does not ship 12 separate apps. All traditions map to one engine with composable options. See [`docs/UNIFIED_ROSCA_MODEL.md`](../../docs/UNIFIED_ROSCA_MODEL.md) and cultural presets in the API (`GET /api/v1/groups/presets`).

A Rotating Savings and Credit Association (ROSCA) is a peer-to-peer banking and lending system where a group of individuals agree to contribute a fixed amount of money at regular intervals. The total collected (the "pot") is then given to one member of the group. This rotates until every member has received the pot.

This mechanism exists globally, particularly in regions with historically low bankarization or where traditional credit is inaccessible, expensive, or culturally inappropriate. 

Below is an exhaustive documentation of these practices across Africa and Asia.

## 1. Africa: The Birthplace of Community Solidarity

### Democratic Republic of Congo & Congo-Brazzaville
*   **Name:** Likelemba / Kitemba
*   **Structure:** Often a straightforward rotation among trusted friends, family, or colleagues (e.g., market women, office workers). 
*   **Specificities:** The term "Likelemba" emphasizes solidarity. It is heavily used in informal sectors to buy inventory for small businesses or to cover large expected expenses like school fees or weddings. It is fundamentally built on personal honor and community ties.

### Cameroon (The Bamileke Tribe)
*   **Name:** Tontine / Djangi
*   **Structure:** Highly structured and deeply woven into the cultural, economic, and social fabric of the Bamileke people. The Bamileke Tontine is arguably the most sophisticated ROSCA system in the world, acting as a fully-fledged informal central bank and insurance company for its members.
*   **Specificities & Variants:** Bamileke Tontines go far beyond a simple rotation. They have complex governance and distinct sub-funds running simultaneously:
    *   **Governance & Roles:** A Bamileke tontine operates like a strict corporation. It is led by a *President* (who guides the vision), a *Treasurer* (who handles funds), and crucially, a *Censor* (Censeur). The Censor is the enforcer of discipline, issuing fines (pénalités) for anything from arriving late to a meeting, dressing improperly, or speaking out of turn. This strict discipline maintains the sanctity of the financial commitment.
    *   **La Caisse de Solidarité (The Solidarity/Emergency Fund):** Distinct from the main savings pot, every member contributes a small, non-refundable amount to this fund at each cycle. It acts as an insurance policy. If a member experiences a death in the family, an accident, or a joyous occasion like a wedding, the group votes to disburse funds from this pot. It ensures no member faces an emergency alone.
    *   **La Tontine à Enchères (The Bidding/Auction Tontine):** Instead of a fixed rotation where someone gets the pot by luck or schedule, members *bid* for the pot. If the pot is $10,000, a businessman who urgently needs capital to buy inventory might bid to pay $1,500 in interest over the cycle. The pot goes to the highest bidder. The beauty of this system is that the $1,500 interest paid is later divided among all the other members as a dividend. It serves as both a rapid credit line for those who need cash and a high-yield investment for those who wait.
    *   **La Caisse de Secours (The Short-Term Loan Fund):** Some tontines hold back a portion of the funds to offer high-interest, ultra-short-term loans (e.g., 1 to 4 weeks) to members facing temporary liquidity crises.
    *   **Social Capital as Collateral:** Defaulting on a Bamileke Tontine is a social death sentence. It brings immense shame to the defaulter's family and results in absolute exclusion from the Bamileke community network—which is often essential for business success in Cameroon. This extreme social pressure makes the system almost foolproof in traditional settings.

### South Africa
*   **Name:** Stokvel
*   **Structure:** Encompasses ROSCAs but has evolved into broader Accumulating Savings and Credit Associations (ASCAs) and investment clubs.
*   **Specificities:** Stokvels are a massive economic force in South Africa (estimated at over R50 billion annually). 
    *   They are categorized by purpose: *Burial Stokvels* (insurance for funerals), *Grocery Stokvels* (buying bulk groceries at year-end), and *Investment Stokvels* (buying real estate or stocks).
    *   They often involve social gatherings, parties, and communal decision-making.

### West Africa (Nigeria, Ghana)
*   **Name:** Susu / Esusu (Nigeria), Ajo (Yoruba)
*   **Structure:** Can be a standard ROSCA, or managed by a professional "Susu Collector".
*   **Specificities:** A Susu Collector visits market vendors daily to collect a small, fixed amount. At the end of the month, the collector returns the accumulated sum to the vendor, minus one day's contribution as their fee. This provides extreme convenience and discipline for daily wage earners.

### Kenya & East Africa
*   **Name:** Chama
*   **Structure:** Swahili for "group". Originally informal ROSCAs, many have formalized.
*   **Specificities:** Chamas in Kenya are highly ambitious. Many have registered as formal companies to buy land, build apartment complexes, or invest in the Nairobi Stock Exchange. They demonstrate how a trust-based savings group can scale into a legitimate investment powerhouse.

---

## 2. Asia: Bidding, Dividends, and Enterprise

### India
*   **Name:** Chit Funds (Chitty)
*   **Structure:** A highly formalized hybrid of savings and borrowing. It is unique globally because it is legally recognized, heavily regulated by the government (Chit Funds Act of 1982), and often run by registered corporations rather than informal community leaders.
*   **Specificities & Variants:** 
    *   **The Foreman (Organizer):** Chit Funds are managed by a "Foreman" (often a registered financial company) who handles all administration, legal compliance, and debt collection. In exchange, the Foreman takes a fixed commission (usually 5%) and is often entitled to the very first pot without bidding.
    *   **The Reverse Auction:** Members bid for the pot by accepting a "discount". For example, if the pot is $1,000, a member in desperate need of cash might bid a $200 discount, meaning they are willing to take only $800. The remaining $200 is distributed evenly among the other members as a dividend/profit. This creates a highly efficient internal market for interest rates based on real-time liquidity needs.

### China & The Chinese Diaspora
*   **Name:** Hui / Biao Hui (Bidding Hui)
*   **Structure:** Historically critical for Chinese immigrants in the US, Europe, and Southeast Asia to start businesses (like restaurants or laundromats) when they were excluded from traditional Western banking systems.
*   **Specificities & Variants:** 
    *   **The Guarantor Head (Huitou):** The group is organized by a Head (Huitou). The Huitou takes on immense risk: they are personally responsible for the group's success. If a member defaults or runs away, the Huitou *must* pay the missing amount out of their own pocket to keep the Hui running.
    *   **The Leader's Privilege:** Because the Huitou assumes all the risk, they are universally granted the privilege of receiving the very first pot—interest-free and without having to bid. This incentivizes community leaders to organize Hui and take on the guarantor risk.

### Indonesia
*   **Name:** Arisan
*   **Structure:** Deeply ingrained in Indonesian culture across all social classes. It is characterized by its heavy emphasis on the social gathering, gossiping, community building, and fairness.
*   **Specificities & Variants:** 
    *   **The Lottery System (Kocokan):** Unlike bidding systems, Arisan focuses on absolute fairness and gamification. Members gather (often monthly), contribute their funds, and draw lots (names from a glass or a rolling wheel) to see who takes the pot. It turns savings into a highly anticipated social event.
    *   **Arisan Barang (Goods Arisan):** Instead of cash, the pot is sometimes used to purchase specific goods. For example, a group of housewives might form an Arisan where the "pot" is a set of expensive Tupperware, a refrigerator, or even gold (Arisan Emas). The winner of the lottery gets the item that month.

### Japan
*   **Name:** Mujin / Tanomoshi
*   **Structure:** Traditional mutual credit associations dating back to the Kamakura period (1185–1333).
*   **Specificities & Variants:** While less common today due to advanced modern banking, Mujin were the evolutionary foundation for many of Japan's modern mutual savings banks (Sogo banks). They often incorporated complex lotteries and bidding, demonstrating how an informal ROSCA can scale over centuries into a formal banking sector.

---

## The Core Problem with Traditional ROSCAs

Across all these cultures, the fundamental limitation is **TRUST**.

1.  **Scale:** You can only form a group with people you personally know and trust, limiting the pot size and network effects.
2.  **Geography:** Members usually need to be in the same physical location to enforce social pressure and collect physical cash.
3.  **Vulnerability:** The system relies entirely on human behavior. If the organizer runs away, or a member defaults, dies, or loses their job, the entire system collapses, and members lose their money with zero legal recourse.

**SoSo's Mission:** To take the universally proven concept of the ROSCA, abstract the "Trust" element into an "Algorithm," and allow it to scale globally, securely, and seamlessly.