/**
 * @fileoverview CategoryListSection Component
 * 
 * A featured categories section that displays game categories in an attractive 
 * grid layout. This component helps users discover games by category type 
 * (PvP, PvE, etc.) and serves as a key navigation mechanism.
 * 
 * Features:
 * - Responsive grid layout
 * - Featured category display
 * - Professional section styling
 * - Accessibility support
 * - Theme integration
 * - Semantic HTML structure
 * 
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

import React from 'react';
import categories from '../../data/categories';
import CategoryCard from '../molecules/CategoryCard';

// Import theme and component styles
import '../../styles/theme.css';
import '../../styles/utilities.css';
import '../../styles/sections/CategoryList.css';

/**
 * CategoryListSection Component
 * 
 * Renders a section showcasing game categories in a responsive grid.
 * Each category is displayed using the CategoryCard component, providing 
 * consistent styling and interaction patterns across the platform.
 * 
 * The component uses semantic HTML with proper heading hierarchy and
 * follows accessibility best practices for screen reader compatibility.
 * 
 * @returns JSX element representing the categories section
 */
const CategoryListSection: React.FC = () => {
  return (
    <section 
      className="category-list-section container mx-container"
      aria-labelledby="categories-heading"
    >
      {/* Section Heading */}
      <h2 
        id="categories-heading"
        className="category-list__title gradient-title"
      >
        Categories
      </h2>
      
      {/* Section Description */}
      <p className="category-list__description">
        Choose your battle style and dominate the arena
      </p>
      
      {/* Decorative Divider */}
      <div className="category-list__divider" aria-hidden="true"></div>
      
      {/* Categories Grid */}
      <div 
        className="category-list__grid"
        role="list"
        aria-label="Game categories collection"
      >
        {categories.map((category) => (
          <div 
            key={category.slug} 
            role="listitem"
            className="category-list__grid-item"
          >
            <CategoryCard
              title={category.title}
              image={category.image}
              slug={category.slug}
              className={category.glowClass}
              ariaLabel={`Explore ${category.title} category`}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryListSection;