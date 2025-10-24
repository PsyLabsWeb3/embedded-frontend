/**
 * @fileoverview CategoryCard Component
 * 
 * A reusable card component for displaying game category information with click 
 * handling for navigation. This component provides a consistent interface for 
 * category discovery and selection throughout the application.
 * 
 * Features:
 * - Responsive design with background images
 * - Keyboard accessibility support
 * - Professional routing with fallback handling
 * - Visual effects and hover states
 * - Screen reader compatible
 * - Game count display
 * 
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/sections/CategoryCard.css';

/**
 * Props interface for the CategoryCard component
 * Extends base UI props for consistent styling and accessibility
 */
interface CategoryCardProps {
  /** Display title of the category */
  title: string;
  /** Path to the category's cover image */
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
 * CategoryCard Component (Internal Implementation)
 * 
 * Internal implementation of the category card component before memoization.
 * This component handles all the core functionality including navigation,
 * accessibility, and user interactions.
 */
const CategoryCardComponent: React.FC<CategoryCardProps> = ({ 
  title, 
  image, 
  slug, 
  className = '',
  testId = `category-card-${slug}`,
  ariaLabel
}) => {
  const navigate = useNavigate();

  /**
   * Professional category route mapping for scalable navigation
   * This approach centralizes route management and provides type safety
   */
  const categoryRoutes: Record<string, string> = {
    'pvp': '/games?category=pvp',
    'pve': '/games?category=pve',
    'puzzle': '/games?category=puzzle',
    'action': '/games?category=action',
    'strategy': '/games?category=strategy',
    'arcade': '/games?category=arcade',
    'casual': '/games?category=casual',
    'multiplayer': '/games?category=multiplayer'
  };

  /**
   * Handles category card click with proper error handling and fallback
   * Uses useCallback for performance optimization in lists
   */
  const handleClick = useCallback(() => {
    const route = categoryRoutes[slug];
    
    if (route) {
      navigate(route);
    } else {
      // Log the error for debugging while providing user feedback
      console.warn(`No route found for category slug: ${slug}`);
      
      // Graceful fallback: navigate to games page
      navigate('/games');
    }
  }, [navigate, slug]);

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
    'category-card',
    className
  ].filter(Boolean).join(' ');

  // Generate accessible aria-label if not provided
  const accessibleLabel = ariaLabel || `Browse ${title} category`;

  return (
    <div className="category-card-outer-wrapper">
      <div
        className={cardClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={accessibleLabel}
        data-testid={testId}
      >
        {/* Category Image */}
        <div className="category-card__image-container">
          <div 
            className="category-card__image"
            style={{ backgroundImage: `url(${image})` }}
          >
            {/* Overlay with content - only visible on mobile */}
            <div className="category-card__overlay">
              <div className="category-card__overlay-content">
                {/* No content inside overlay - clean image */}
              </div>
            </div>
          </div>
        </div>
        
        {/* Category Content - Desktop only, similar to GameCard */}
        <div className="category-card__content">
          {/* Category Title */}
          <h3 className="category-card__title">{title}</h3>
          
          {/* View Games Button */}
          <button
            className="category-card__button"
            onClick={(e) => {
              e.stopPropagation(); // Prevent double click
              handleClick();
            }}
            onKeyDown={handleKeyDown}
            aria-label={`View ${title} games`}
          >
            VIEW GAMES
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Optimized CategoryCard Component
 * 
 * A performance-optimized version of the CategoryCard component that uses
 * React.memo with a custom comparison function to prevent unnecessary
 * re-renders. This is especially important for category lists with multiple cards.
 * 
 * The component will only re-render when props actually change.
 */
const CategoryCard = React.memo(CategoryCardComponent);

export default CategoryCard;