/**
 * @fileoverview HeroStatCard Component
 *
 * A comprehensive gaming platform showcase component that combines a section title,
 * value proposition card, and call-to-action elements. This component serves as the
 * primary engagement driver in the hero section, featuring platform description,
 * user statistics, and conversion-focused elements.
 *
 * The component adapts responsively across devices:
 * - Mobile: Shows only the green card with statistics
 * - Desktop: Displays section title "Where Gaming Meets Crypto" above the card
 *
 * Features:
 * - Responsive section title (desktop-only)
 * - Eye-catching gradient card design
 * - Social proof through player statistics
 * - Professional call-to-action button
 * - Accessibility compliance
 * - Navigation integration
 * - Semantic HTML structure
 *
 * @author Embedded Frontend Team
 * @version 2.0.0
 */

import React from "react";
import { Link } from "react-router-dom";
import { ROUTES, A11Y_LABELS } from "../../constants";
import "../../styles/sections/HeroStatCard.css";

/**
 * HeroStatCard Component
 *
 * Renders a comprehensive gaming platform showcase section that includes both
 * a contextual title and a visually striking call-to-action card. The component
 * combines compelling copy, social proof through player statistics, and a clear
 * action button to drive user engagement and conversions.
 *
 * The section uses responsive design principles:
 * - Mobile: Card-only layout for optimal touch interaction
 * - Desktop: Title + card layout for enhanced visual hierarchy
 *
 * The card features a gradient background and professional typography to create
 * visual hierarchy and guide user attention to the primary conversion action.
 *
 * @returns JSX element representing the complete gaming platform showcase section
 */
const HeroStatCard: React.FC = () => (
  <section className="hero-stat-section">
    {/* Primary Content Card - Platform value proposition and CTA */}
    <article className="hero-stat-card">
      {/* Value Proposition - Core platform benefits */}
      <p className="hero-stat-card__desc">
        A decentralized gaming platform that rewards players with real crypto.
        No accounts needed—just your wallet.
      </p>

      {/* Primary Call-to-Action - Conversion driver */}
      <Link
        to={ROUTES.GAMES}
        className="hero-stat-card__button"
        aria-label={A11Y_LABELS.PLAY_GAME}
      >
        START PLAYING!
      </Link>

      {/* Social Proof - Player Statistics for credibility */}
      <div className="hero-stat-card__stat">
        <div
          className="hero-stat-card__stat-main"
          id="hero-stat-gradient"
          aria-label="Over 250,000 registered players"
        >
          +250K
        </div>
        <span className="hero-stat-card__players">PLAYERS</span>
      </div>
    </article>
  </section>
);

export default HeroStatCard;
