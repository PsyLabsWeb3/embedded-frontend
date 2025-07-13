/**
 * @fileoverview SearchIcon Component
 * 
 * A scalable SVG search icon component that provides consistent visual
 * representation across the application. This atomic component follows
 * accessibility best practices and integrates with the application's
 * design system.
 * 
 * Features:
 * - Scalable SVG implementation
 * - Theme integration with CSS variables
 * - Accessibility support
 * - Consistent styling
 * - Performance optimized
 * 
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

import React from 'react';
import { createMemoizedComponent } from '../../utils/performance';
import '../../styles/sections/SearchIcon.css';

/**
 * Props interface for the SearchIcon component
 */
interface SearchIconProps {
  /** Size of the icon in pixels (default: 24) */
  size?: number;
  /** Custom CSS class name */
  className?: string;
  /** ARIA label for accessibility */
  ariaLabel?: string;
}

/**
 * SearchIcon Component (Internal Implementation)
 * 
 * Renders a magnifying glass icon using SVG for crisp display at any size.
 * The icon uses CSS variables for theming and can be customized via props.
 * 
 * The component is designed to be lightweight and performant, making it
 * suitable for use in navigation bars, search forms, and button interfaces.
 * 
 * @param props - Component props for customization
 * @returns JSX element representing the search icon
 */
const SearchIconComponent: React.FC<SearchIconProps> = ({ 
  size = 24, 
  className,
  ariaLabel = 'Search'
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label={ariaLabel}
    role="img"
  >
    {/* Main search circle */}
    <circle 
      cx="11" 
      cy="11" 
      r="7" 
      stroke="var(--color-text-muted)" 
      strokeWidth="2" 
    />
    
    {/* Search handle */}
    <line 
      x1="16.5" 
      y1="16.5" 
      x2="21" 
      y2="21" 
      stroke="var(--color-text-muted)" 
      strokeWidth="2" 
      strokeLinecap="round" 
    />
  </svg>
);

/**
 * Optimized SearchIcon Component
 * 
 * A memoized version of the SearchIcon that prevents unnecessary re-renders.
 * Since icons rarely change, this optimization provides performance benefits
 * in components that render multiple icons or re-render frequently.
 */
const SearchIcon = createMemoizedComponent(SearchIconComponent, (prevProps, nextProps) => {
  return (
    prevProps.size === nextProps.size &&
    prevProps.className === nextProps.className &&
    prevProps.ariaLabel === nextProps.ariaLabel
  );
});

export default SearchIcon;
