/**
 * @fileoverview GameCard Component
 * 
 * A reusable card component for displaying game information with click handling
 * for navigation. This component provides a consistent interface for game
 * discovery and selection throughout the application.
 * 
 * Features:
 * - Responsive design with background images
 * - Keyboard accessibility support
 * - Professional routing with fallback handling
 * - Visual effects and hover states
 * - Screen reader compatible
 * 
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GAME_ROUTES, A11Y_LABELS } from '../../constants';
import { gameComponentPropsEqual } from '../../utils/performance';
import '../../styles/sections/GameCard.css';

/**
 * Props interface for the GameCard component
 * Extends base UI props for consistent styling and accessibility
 */
interface GameCardProps {
  /** Display title of the game */
  title: string;
  /** Path to the game's cover image */
  image: string;
  /** URL-friendly identifier for routing */
  slug: string;
  /** Optional CSS class name for styling */
  className?: string;
  /** Optional test identifier for testing frameworks */
  testId?: string;
  /** Optional ARIA label for accessibility */
  ariaLabel?: string;
}

/**
 * GameCard Component (Internal Implementation)
 * 
 * Internal implementation of the game card component before memoization.
 * This component handles all the core functionality including navigation,
 * accessibility, and user interactions.
 */
const GameCardComponent: React.FC<GameCardProps> = ({ 
  title, 
  image, 
  slug, 
  className,
  testId = `game-card-${slug}`,
  ariaLabel,
}) => {
  const navigate = useNavigate();

  /**
   * Professional game route mapping for scalable navigation
   * This approach centralizes route management and provides type safety
   */
  const gameRoutes: Record<string, string> = {
    'snake': GAME_ROUTES.SNAKE,
    'pingpong': GAME_ROUTES.PING_PONG,
    'bubblemerge': GAME_ROUTES.BUBBLE_MERGE,
    'candysweet': GAME_ROUTES.CANDY_SWEET,
    'sortpuzzle': GAME_ROUTES.SORT_PUZZLE,
    'pipesflood': GAME_ROUTES.PIPES_FLOOD,
    'hoverracer': GAME_ROUTES.HOVER_RACER,
    'infiniterunner': GAME_ROUTES.INFINITE_RUNNER,
    'cakemania': GAME_ROUTES.CAKE_MANIA,
    'game10': GAME_ROUTES.GAME_10,
    'game11': GAME_ROUTES.GAME_11
  };

  /**
   * Handles game card click with proper error handling and fallback
   * Uses useCallback for performance optimization in lists
   */
  const handleClick = useCallback(() => {
    const route = gameRoutes[slug];
    
    if (route) {
      navigate(route);
    } else {
      // Log the error for debugging while providing user feedback
      console.warn(`No route found for game slug: ${slug}`);
      
      // Graceful fallback: navigate to games page
      navigate('/games');
    }
  }, [navigate, slug, gameRoutes]);

  /**
   * Handles keyboard navigation for accessibility
   * Supports Enter and Space keys as per ARIA best practices
   */
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  // Combine CSS classes for flexible styling
  const cardClasses = [
    'game-card',
    'game-cover-placeholder',
    className
  ].filter(Boolean).join(' ');

  // Generate accessible aria-label if not provided
  const accessibleLabel = ariaLabel || `${A11Y_LABELS.GAME_CARD} ${title}`;

  return (
    <div className="game-card-outer-wrapper">
      <div
        className={cardClasses}
        style={{ backgroundImage: `url(${image})` }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={accessibleLabel}
        data-testid={testId}
      >
        <span className="game-card-title">{title}</span>
      </div>
    </div>
  );
};

/**
 * Optimized GameCard Component
 * 
 * A performance-optimized version of the GameCard component that uses
 * React.memo with a custom comparison function to prevent unnecessary
 * re-renders. This is especially important for game lists with multiple cards.
 * 
 * The component will only re-render when:
 * - title changes
 * - image changes  
 * - slug changes
 * - className changes
 * 
 * @param props - Component props containing game information and styling
 * @returns Memoized JSX element representing the game card
 */
const GameCard = React.memo(GameCardComponent, gameComponentPropsEqual);

export default GameCard;
