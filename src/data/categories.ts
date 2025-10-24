/**
 * @fileoverview Category Display Data Registry
 * 
 * This file contains the category data used for displaying category cards, 
 * navigation and game filtering throughout the application. Categories help
 * organize games into logical groups for better user experience.
 * 
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

import type { CategoryTypes } from '../types';
// Import placeholder images - these will be replaced with actual category images
import embeddedWarsImage from '../assets/embedded_wars.jpg';
import colosseumImage from '../assets/ColosseumCover.png';

/**
 * Category data interface for UI display
 * Uses the CategoryTypes.Category interface for type safety
 */
export type Category = CategoryTypes.Category;

/**
 * Category display data for cards, lists, and navigation
 * 
 * This array contains the visual and routing information for all game categories
 * displayed in the application. Each entry corresponds to a category that
 * users can explore to find related games.
 * 
 * Note: The slug field is used for routing to category-specific pages.
 */
const categories: Category[] = [
  // Player vs Player Category
  {
    id: 'pvp-category',
    title: 'PvP',
    slug: 'pvp',
    image: embeddedWarsImage, // Temporary - replace with actual PvP image
    glowClass: 'neon-red',
    description: 'Player vs Player battles',
    gameCount: 2,
    isFeatured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-11-01'),
    icon: '⚔️'
  },

  // Player vs Environment Category
  {
    id: 'pve-category',
    title: 'PvE',
    slug: 'pve',
    image: colosseumImage, // Temporary - replace with actual PvE image
    glowClass: 'neon-purple',
    description: 'Player vs Environment adventures',
    gameCount: 3,
    isFeatured: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-11-01'),
    icon: '🏛️'
  }
];

export default categories;

/**
 * Helper functions for category operations
 */

/**
 * Get a category by its slug
 * @param slug - The category slug to search for
 * @returns The category object or undefined if not found
 */
export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(category => category.slug === slug);
};

/**
 * Get all featured categories
 * @returns Array of featured categories
 */
export const getFeaturedCategories = (): Category[] => {
  return categories.filter(category => category.isFeatured);
};

/**
 * Get total game count across all categories
 * @returns Total number of games
 */
export const getTotalGameCount = (): number => {
  return categories.reduce((total, category) => total + category.gameCount, 0);
};