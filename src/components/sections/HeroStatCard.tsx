/**
 * @fileoverview HeroStatCard Component
 * 
 * A prominent call-to-action card component displayed in the hero section.
 * Features player statistics, platform description, and a primary action
 * button for user engagement. Designed to drive conversions and showcase
 * platform credibility.
 * 
 * Features:
 * - Eye-catching gradient design
 * - Responsive layout optimization
 * - Professional call-to-action
 * - Accessibility compliance
 * - Navigation integration
 * 
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES, A11Y_LABELS } from '../../constants';
import '../../styles/sections/HeroStatCard.css';

/**
 * HeroStatCard Component
 * 
 * Renders a visually striking card that serves as the primary call-to-action
 * in the hero section. The component combines compelling copy, social proof
 * through player statistics, and a clear action button to drive engagement.
 * 
 * The card uses a gradient background and professional typography to create
 * visual hierarchy and guide user attention to the primary action.
 * 
 * @returns JSX element representing the hero statistics and CTA card
 */
const HeroStatCard: React.FC = () => (
  <article className="hero-stat-card">
    {/* Primary Heading */}
    <h2 className="hero-stat-card__title">
      Play. Compete. Earn.
    </h2>
    
    {/* Value Proposition */}
    <p className="hero-stat-card__desc">
      A decentralized gaming platform rewarding players with real crypto—no 
      accounts, no tokens, just your wallet.
    </p>
    
    {/* Primary Call-to-Action */}
    <Link 
      to={ROUTES.GAMES} 
      className="hero-stat-card__button"
      aria-label={A11Y_LABELS.PLAY_GAME}
    >
      START PLAYING!
    </Link>
    
    {/* Social Proof - Player Statistics */}
    <div className="hero-stat-card__stat">
      <div 
        className="hero-stat-card__stat-main" 
        id="hero-stat-gradient"
        aria-label="Over 250,000 registered players"
      >
        +250K
      </div>
      <span className="hero-stat-card__players">
        PLAYERS
      </span>
    </div>
  </article>
);

export default HeroStatCard;
