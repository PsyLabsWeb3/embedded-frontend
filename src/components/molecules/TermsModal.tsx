/**
 * @fileoverview Terms and Conditions Modal Component
 *
 * A modal dialog that displays the platform's terms and conditions to new users.
 * The modal appears on first visit and requires explicit acceptance before
 * allowing interaction with the platform. Uses localStorage to track acceptance.
 *
 * @author Embedded Frontend Team
 * @version 1.0.0
 */
import React, { useState, useEffect } from 'react';
import './TermsModal.css';

/**
 * Local storage key for tracking terms acceptance
 */
const TERMS_ACCEPTED_KEY = 'termsAccepted';

/**
 * TermsModal Component
 *
 * Displays a modal dialog with the complete terms and conditions.
 * Features:
 * - Shows only on first visit (checks localStorage)
 * - Blocks interaction with rest of platform until accepted
 * - Scrollable content area for long terms text
 * - Non-dismissible (must click Accept button)
 * - Responsive design for mobile and desktop
 *
 * @returns JSX element containing the modal or null if already accepted
 */
const TermsModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted terms
    const hasAccepted = localStorage.getItem(TERMS_ACCEPTED_KEY);
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  /**
   * Handles the acceptance of terms and conditions
   * Saves acceptance to localStorage and hides the modal
   */
  const handleAccept = () => {
    localStorage.setItem(TERMS_ACCEPTED_KEY, 'true');
    setIsVisible(false);
  };

  // Don't render anything if already accepted
  if (!isVisible) {
    return null;
  }

  return (
    <div className="terms-modal-overlay">
      <div className="terms-modal-container">
        <div className="terms-modal-header">
          <h2>TERMS & CONDITIONS</h2>
        </div>

        <div className="terms-modal-content">
          <section>
            <h3>1. Introduction</h3>
            <p>
              These Terms and Conditions ("Terms") govern your access to and use of the
              Embedded.Games website, mobile app, smart contracts, and related services (the
              "Platform" or "Services") operated by Embedded Games, a company incorporated under
              the laws of Republic of Vanuatu ("Company", "we", "us"). By connecting your digital
              wallet and using the Platform you agree to these Terms. If you do not agree, do not
              connect your wallet or use the Platform.
            </p>
            <p>
              <strong>IMPORTANT:</strong> The Platform is a skill-based, wallet-native, non-custodial gaming service
              that uses Solana ("SOL") for wagers, deposits, and payouts. The Platform does not
              require registration, usernames, or traditional accounts — you participate by connecting
              an externally-owned crypto wallet (currently supported: Phantom). All on-chain actions
              are final and governed by published smart contracts.
            </p>
          </section>

          <section>
            <h3>2. Definitions</h3>
            <ul>
              <li><strong>"Wallet"</strong> — your externally owned Solana wallet (e.g., Phantom) that you connect to the Platform.</li>
              <li><strong>"Match"</strong> — a single PvP game between two players where both parties place a wager in SOL.</li>
              <li><strong>"Casual Mode"</strong> — a fixed-stake game mode where each player stakes $0.50 (or the SOL equivalent) and the winner receives the pooled wagers minus the Platform commission.</li>
              <li><strong>"Degen Mode"</strong> — a flexible-stake game mode in which players agree on wager amounts; the winner receives the pooled wagers minus the Platform commission.</li>
              <li><strong>"Smart Contract"</strong> — the on-chain code that receives wagers, enforces match rules, and executes payouts.</li>
              <li><strong>"Exit Button"</strong> — the on-UI function that allows a waiting player to cancel/withdraw their wager prior to being matched.</li>
              <li><strong>"Leaderboard"</strong> — the public ranking of players used to distribute the monthly revenue share airdrops.</li>
            </ul>
          </section>

          <section>
            <h3>3. Eligibility, Age & Geographic Restrictions</h3>
            <h4>3.1 Age</h4>
            <p>
              You must be at least the minimum legal age in your jurisdiction to participate in
              skill-based wagering and to use our Services. Unless otherwise specified, the minimum
              age is 18 years old. If local law requires a higher minimum age, you must meet that
              higher age. By connecting a Wallet, you represent and warrant that you meet the
              applicable age requirement.
            </p>
            <h4>3.2 Geographic eligibility & restricted jurisdictions</h4>
            <p>
              You must not use the Platform from, or on behalf of any person located in, any jurisdiction where participation would be
              unlawful or where we have determined to restrict access. Without limiting the foregoing,
              you may not use the Platform if you are located in, a citizen of, a resident of, or a U.S.
              person (as defined by U.S. regulations), or otherwise in a jurisdiction where the
              Platform's Services would violate local law or sanctions. Examples of jurisdictions we
              currently restrict include (but are not limited to): the United States of America, the
              People's Republic of China, Singapore, and any jurisdiction subject to comprehensive
              international sanctions or domestic bans on online wagering. You are responsible for
              compliance with your local laws.
            </p>
            <h4>3.3 Sanctions & prohibited persons</h4>
            <p>
              You must not be listed on any sanction lists (e.g., OFAC Specially Designated Nationals) or be located in a sanctioned jurisdiction. We
              reserve the right to block Wallets or transactions that we reasonably believe are
              connected to sanctioned individuals, entities, or jurisdictions.
            </p>
          </section>

          <section>
            <h3>4. Account Model: Wallet-Only, Non-Custodial</h3>
            <h4>4.1 No account creation</h4>
            <p>
              The Platform uses a wallet-based model: you participate by connecting your Wallet. We do not create or maintain traditional user accounts,
              usernames, or passwords for you. Your Wallet address functions as your identifier.
            </p>
            <h4>4.2 Non-custodial operation</h4>
            <p>
              All funds remain in your control until they are sent to the smart contract. We do not custody your private keys, and we never take custody of SOL
              off-chain. You are solely responsible for securing your Wallet and private keys. If you
              lose access to your Wallet, we cannot recover it.
            </p>
            <h4>4.3 Wallet support</h4>
            <p>
              At launch the Platform supports the Phantom wallet. We may add or remove support for other wallets at our discretion.
            </p>
          </section>

          <section>
            <h3>5. Deposits, Wagers & Withdrawals</h3>
            <h4>5.1 How deposits work</h4>
            <p>
              To join a Match you must connect your Wallet and submit the required SOL to the smart contract for the chosen game mode. Transactions must be
              confirmed on the Solana network before you are eligible to be paired.
            </p>
            <h4>5.2 Irreversible blockchain transactions</h4>
            <p>
              All on-chain transactions are final once confirmed on the Solana blockchain. We cannot reverse or cancel on-chain transactions
              except as explicitly provided by the smart contract's logic.
            </p>
            <h4>5.3 Withdrawals & refunds</h4>
            <p>
              If you properly use the Exit Button before you are matched with another player, you may withdraw your funds and cancel the lobby. If you do not
              press Exit and another player joins, the match will proceed and your funds will be
              treated as a stake. Once a match is confirmed on-chain, funds are only returned to the
              loser as defined by the smart contract (which is typically nothing) or paid to the winner
              per smart contract logic. YOU ARE RESPONSIBLE FOR USING THE EXIT BUTTON
              CORRECTLY — failure to do so is not the Company's responsibility.
            </p>
            <h4>5.4 Gas/Network & conversion risk</h4>
            <p>
              You are responsible for any network fees and for converting fiat equivalents for display. We are not responsible for network congestion,
              failed transactions, or Solana network faults.
            </p>
          </section>

          <section>
            <h3>6. Game Modes, Fees, Commissions & Payouts</h3>
            <h4>6.1 Casual Mode (fixed stake)</h4>
            <p>
              Each player stakes $0.50 (or the SOL equivalent) to enter the Match. The match pool equals both players' stakes. The Platform charges a
              commission of $0.10 per player (i.e., $0.20 total), and the winner receives the
              remainder. Exact SOL amounts are converted at the on-platform SOL/fiat rate at the
              time the wager is made; exchange volatility is the player's responsibility.
            </p>
            <h4>6.2 Degen Mode (variable stake)</h4>
            <p>
              Players may agree to wager any amount denominated in SOL. The Platform does not charge the flat fee used in Casual Mode
              but instead charges a commission equal to 10% of the winner's pooled winnings.
              Example: if Player A and Player B each wager 10 SOL and Player A wins, the Platform
              will automatically retain 10% of the pooled winnings, and the remainder will be sent to
              the winner as specified by the smart contract.
            </p>
            <h4>6.3 Fees collection & distribution</h4>
            <p>
              All fees and commissions are collected on-chain or via the smart contract at the moment of payout. We reserve the right to change fees, fold in
              promotional discounts, or set ceilings/floors for wager amounts.
            </p>
            <h4>6.4 Taxes</h4>
            <p>
              You are solely responsible for any taxes or reporting obligations arising from winnings, airdrops, or other Platform activity. The Company does not provide tax advice.
            </p>
          </section>

          <section>
            <h3>7. Matchmaking, Lobby Rules & Refunds</h3>
            <h4>7.1 Matchmaking</h4>
            <p>
              Matching is primarily geographic/region-based to reduce latency. Matching is NOT based on points, skill rating, or rank. We do not guarantee time to
              match.
            </p>
            <h4>7.2 Exit Button & refund mechanics</h4>
            <p>
              When you create a lobby and deposit your stake, you may press the Exit Button at any time before being paired to receive a full refund of
              the stake to your Wallet (less network fees). If you fail to press the Exit Button and a
              second player joins, the match is activated and the stake becomes subject to the smart
              contract's match rules — there will be no refund unless the smart contract specifies
              otherwise.
            </p>
            <h4>7.3 No manual refunds after match activation</h4>
            <p>
              Once a match is on-chain and both stakes have been accepted by the smart contract, payouts are final as executed by the
              smart contract. The Company will not manually intervene to reverse or alter match
              outcomes except in limited circumstances (e.g., verified smart contract bug, proven
              security incident) and only where the Company reasonably determines an intervention
              is necessary.
            </p>
            <h4>7.4 Exploits, bugs & rollback</h4>
            <p>
              If a critical bug or exploit is discovered and the Company determines that a manual intervention is necessary to protect users or Platform integrity,
              we may take corrective actions — including but not limited to temporarily disabling the
              Services, pausing smart contract functions, or, in exceptional cases, pursuing chain
              rollbacks through agreed community-governance mechanisms (if available). Such
              actions are exceptional and not guaranteed.
            </p>
          </section>

          <section>
            <h3>8. Leaderboard, Points System & Monthly Revenue Share (Airdrops)</h3>
            <h4>8.1 Points</h4>
            <p>
              The Platform uses a points system where a win awards 2 points and a loss awards 1 point. Points accumulate during the monthly period and are used to rank
              players on the Leaderboard.
            </p>
            <h4>8.2 Eligibility for revenue share</h4>
            <p>
              At the end of each calendar month the Platform will distribute 20% of that month's gross revenue to the top 500 players by Leaderboard
              rank as an airdrop in SOL (or other token at Company discretion). The Company will
              calculate the eligible distribution and the number of tokens each player will receive at its
              sole discretion, according to a published formula and any applicable eligibility rules.
            </p>
            <h4>8.3 Tiebreakers & finality</h4>
            <p>
              The Company will publish tiebreaker rules (for example: higher win count, earlier achievement time) for resolving Leaderboard ties. All
              Leaderboard placements and distributions are final once executed on-chain.
            </p>
            <h4>8.4 Taxes & reporting</h4>
            <p>
              Recipients of airdrops are responsible for any taxes and reporting obligations. The Company may be required to report or withhold amounts in accordance
              with applicable law.
            </p>
          </section>

          <section>
            <h3>9. Smart Contracts, Finality & You Accept Blockchain Risks</h3>
            <h4>9.1 Smart contract finality</h4>
            <p>
              The outcome of Matches and the computations that determine payouts are controlled by smart contract logic. You accept that smart contract
              execution is deterministic and final subject to the smart contract's code and the
              blockchain's settlement rules.
            </p>
            <h4>9.2 Risks</h4>
            <p>
              You acknowledge that using blockchain systems has inherent risks (e.g., software bugs, protocol upgrades, network forks, transaction finality limitations, and
              third-party wallet compromise). The Company is not liable for such risks except where
              caused by the Company's proven gross negligence or willful misconduct.
            </p>
          </section>

          <section>
            <h3>10. KYC, AML, Sanctions & Fraud Prevention</h3>
            <h4>10.1 AML/KYC policy</h4>
            <p>
              The Platform currently operates on an anonymous wallet model and does not generally require KYC for playing. However, the Company is committed to
              complying with anti-money laundering and sanctions obligations. The Company may, in
              its sole discretion, require Wallet owners to complete identity verification,
              source-of-funds checks, or other due diligence measures before permitting deposits,
              withdrawals, airdrop distributions, or other activities.
            </p>
            <h4>10.2 Right to block or freeze</h4>
            <p>
              We reserve the right to block Wallet addresses, withhold airdrops, refuse to process transactions, or otherwise restrict access if we suspect
              money laundering, terrorist financing, fraud, sanctioned-party involvement, or other
              illegal activity.
            </p>
            <h4>10.3 Regulatory compliance</h4>
            <p>
              Virtual assets are subject to increasing regulation globally, and the Company may be required to implement enhanced KYC/AML procedures or to
              limit or suspend Services in particular jurisdictions in order to comply with applicable
              law.
            </p>
          </section>

          <section>
            <h3>11. Prohibited Conduct</h3>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Platform for money laundering, terrorist financing, or any illegal purpose.</li>
              <li>Attempt to manipulate matches, results, or smart contract logic (including exploiting bugs, using bots, cheating, or tampering with the Platform).</li>
              <li>Create multiple Wallets to unfairly influence Leaderboards, rewards, or promotions.</li>
              <li>Facilitate chargebacks, disputes, or otherwise attempt to reverse on-chain transactions.</li>
              <li>Use the Platform on behalf of persons who are ineligible by age, geography, sanctions, or other restrictions.</li>
            </ul>
            <p>
              The Company reserves the right to investigate suspected misconduct and to suspend or
              terminate Wallets or block addresses where it reasonably suspects abuse.
            </p>
          </section>

          <section>
            <h3>12. Privacy & Data</h3>
            <h4>12.1 What we collect</h4>
            <p>
              Because we operate a wallet-only model we do not collect traditional personal data at sign-up. We may collect or process the following data in
              connection with platform use: Wallet addresses, on-chain transaction records, IP
              addresses, device identifiers, usage analytics, and any information you voluntarily
              provide via support channels (e.g., Discord).
            </p>
            <h4>12.2 Privacy notices & rights</h4>
            <p>
              The Company maintains a separate Privacy Policy describing what data we collect, how we use it, retention periods, and user rights
              (including GDPR/CCPA trade-offs). If you are located in a jurisdiction that grants you
              certain data rights, please consult our Privacy Policy for how to exercise them.
            </p>
            <h4>12.3 Public blockchain</h4>
            <p>
              By interacting on-chain, you acknowledge that your Wallet address and transaction data will be publicly visible on the Solana blockchain and may
              be correlated with other information by third parties.
            </p>
          </section>

          <section>
            <h3>13. Warranties, Disclaimers & No Guarantees</h3>
            <h4>13.1 No warranties</h4>
            <p>
              THE PLATFORM, THE WEBSITE, SMART CONTRACTS, CONTENT, AND SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE"
              WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
              IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE, OR NON-INFRINGEMENT.
            </p>
            <h4>13.2 No guarantee of winnings</h4>
            <p>
              The Company does not guarantee match outcomes, earnings, playtime, matchmaking speed, or leaderboard positions.
            </p>
            <h4>13.3 Third parties</h4>
            <p>
              The Platform may integrate third-party services (wallet providers, oracles, price feeds). We do not warrant the availability or accuracy of third-party
              services.
            </p>
          </section>

          <section>
            <h3>14. Limitation of Liability & Indemnification</h3>
            <h4>14.1 Limitation of liability</h4>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT WILL THE COMPANY, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS,
              OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
              CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES ARISING FROM OR
              RELATED TO YOUR USE OF THE PLATFORM, INCLUDING LOSS OF FUNDS, LOSS
              OF PROFITS, LOSS OF DATA, OR FAILURE TO PROCESS TRANSACTIONS, EVEN
              IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <h4>14.2 Cap on direct damages</h4>
            <p>
              Where jurisdiction permits, the Company's aggregate liability for direct damages resulting from the Platform will be limited to the lesser of the
              total fees actually paid by you to the Platform in the six (6) months prior to the claim,
              except to the extent caused by gross negligence or willful misconduct.
            </p>
            <h4>14.3 Indemnification</h4>
            <p>
              You agree to indemnify, defend, and hold harmless the Company and its affiliates from any claims, losses, liabilities, damages, costs, and expenses
              (including reasonable legal fees) arising out of or related to your use of the Platform,
              violation of these Terms, or any activity related to your Wallet.
            </p>
          </section>

          <section>
            <h3>15. Suspension & Termination</h3>
            <h4>15.1 Termination by you</h4>
            <p>
              You may stop using the Platform at any time by ceasing to connect your Wallet and by withdrawing funds subject to smart contract rules.
            </p>
            <h4>15.2 Termination by Company</h4>
            <p>
              The Company may suspend or terminate access to the Platform, or block Wallet addresses, in its sole discretion for violations of these Terms,
              suspected unlawful activity, or for operational or security reasons.
            </p>
            <h4>15.3 Effect of termination</h4>
            <p>
              Termination does not relieve you of obligations incurred prior to termination, including outstanding fees or indemnification responsibilities.
            </p>
          </section>

          <section>
            <h3>16. Dispute Resolution, Governing Law & Class Action Waiver</h3>
            <h4>16.1 Governing law</h4>
            <p>
              These Terms are governed by the laws of the Republic of Vanuatu without regard to conflict of laws rules.
            </p>
            <h4>16.2 Arbitration & waiver of class actions</h4>
            <p>
              Except where prohibited by law, you agree that disputes arising from these Terms will be resolved by binding arbitration and that you and the Company waive any right to a jury trial or to participate in a class
              action.
            </p>
            <h4>16.3 Injunctive relief</h4>
            <p>
              Nothing in this section prevents either party from seeking injunctive or other equitable relief from courts of competent jurisdiction to prevent
              immediate and irreparable harm.
            </p>
          </section>

          <section>
            <h3>17. Modifications to Services & Terms</h3>
            <p>
              We may change, modify, suspend, or discontinue any part of the Platform and these
              Terms at any time. Material changes to the Terms will be published on the Platform with
              an updated date. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h3>18. Intellectual Property</h3>
            <p>
              All intellectual property, trademarks, logos, content, and software on the Platform are
              owned by or licensed to the Company. You may not copy, reproduce, distribute, or
              create derivative works without our express written consent.
            </p>
          </section>

          <section>
            <h3>19. Notices & Contact</h3>
            <p>
              If you need to contact us regarding these Terms, support, or suspected abuse, please
              contact: <strong>admin@embedded.games</strong>
            </p>
          </section>

          <section>
            <h3>20. General Provisions</h3>
            <ul>
              <li><strong>Entire agreement.</strong> These Terms, the Privacy Policy, and any other documents expressly incorporated by reference constitute the entire agreement between you and the Company.</li>
              <li><strong>Severability.</strong> If any provision of these Terms is held invalid or unenforceable, the remaining provisions will remain in effect.</li>
              <li><strong>No waiver.</strong> A failure by the Company to enforce any right or provision will not constitute a waiver of such right or provision.</li>
            </ul>
          </section>
        </div>

        <div className="terms-modal-footer">
          <button onClick={handleAccept} className="terms-accept-button">
            Accept Terms & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
