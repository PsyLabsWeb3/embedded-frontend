/**
 * @fileoverview Snake Game Page Component
 * 
 * A game page component for the Snake game that integrates with the
 * unified game page system. This component follows the established
 * pattern for game page implementations and provides a consistent
 * user experience across all games.
 * 
 * The component uses the GamePage wrapper which handles:
 * - Navigation and layout
 * - Game configuration loading
 * - Error handling and fallbacks
 * - Consistent styling and theming
 * 
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

import React from 'react';
import GamePage from '../GamePage';

/**
 * Snake Game Page Component
 * 
 * Renders the Snake game using the standardized GamePage template.
 * The component passes the game ID to load the appropriate configuration
 * from the game registry, including Unity assets, instructions, and metadata.
 * 
 * The customContent prop is currently set to an empty div as per the
 * established pattern, but can be extended with game-specific UI elements
 * such as custom controls, leaderboards, or game-specific information.
 * 
 * @returns JSX element representing the complete Snake game page
 */
const Snake: React.FC = () => {
  return (
    <GamePage 
      gameId="01-snake"
      customContent={<div />}
    />
  );
};

export default Snake;
