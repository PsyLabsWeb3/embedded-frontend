/**
 * @fileoverview GamePage Component
 * 
 * A unified game page component that provides a consistent interface for
 * displaying games across the platform. This component handles game
 * configuration loading, Unity game rendering, placeholder states, and
 * error handling in a centralized, maintainable way.
 * 
 * Features:
 * - Automatic game configuration loading
 * - Unity WebGL game integration
 * - Placeholder game support
 * - Error handling and fallbacks
 * - Consistent layout and styling
 * - Custom content extension points
 * 
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

import React from 'react';
import GamePageTemplate from '../templates/GamePageTemplate';
import UnityGame from './UnityGame';
import PlaceholderGame from './PlaceholderGame';
import { useGameConfig } from '../../hooks/useGameConfig';
import { ERROR_MESSAGES } from '../../constants';

/**
 * Props interface for the GamePage component
 */
interface GamePageProps {
  /** Unique identifier for the game to load */
  gameId: string;
  /** Optional custom content to render alongside the game */
  customContent?: React.ReactNode;
}

/**
 * GamePage Component
 * 
 * A comprehensive game page component that automatically loads game
 * configurations and renders the appropriate game content. The component
 * provides a consistent user experience across all games while supporting
 * different game types and states.
 * 
 * The component handles three main scenarios:
 * 1. Unity games with asset configurations
 * 2. Placeholder games for unreleased content
 * 3. Error states for invalid or missing games
 * 
 * @param props - Component props containing game ID and optional custom content
 * @returns JSX element representing the complete game page
 */
const GamePage: React.FC<GamePageProps> = ({ 
  gameId, 
  customContent
}) => {
  const gameConfig = useGameConfig(gameId);

  /**
   * Handle case where game configuration is not found
   * Provides user-friendly error messaging and maintains layout consistency
   */
  if (!gameConfig) {
    return (
      <GamePageTemplate
        gameTitle={ERROR_MESSAGES.GAME_NOT_FOUND}
        gameComponent={
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center', 
            color: 'var(--color-text-secondary)' 
          }}>
            {ERROR_MESSAGES.GAME_NOT_FOUND}: "{gameId}"
          </div>
        }
      />
    );
  }

  /**
   * Render the appropriate game component based on configuration
   * 
   * This function determines which type of game content to render:
   * - PlaceholderGame for games marked as placeholders
   * - UnityGame for games with Unity WebGL assets
   * - Error message for incomplete configurations
   * 
   * @returns JSX element representing the game content
   */
  const renderGameComponent = (): React.ReactNode => {
    // Handle placeholder games (coming soon)
    if (gameConfig.placeholder) {
      return <PlaceholderGame gameName={gameConfig.title} />;
    }

    // Handle Unity games with proper asset configuration
    if (gameConfig.assets) {
      return <UnityGame gameAssets={gameConfig.assets} />;
    }

    // Handle incomplete game configurations
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        color: 'var(--color-text-secondary)' 
      }}>
        {ERROR_MESSAGES.GAME_LOAD_FAILED}
      </div>
    );
  };

  return (
    <GamePageTemplate
      gameTitle={gameConfig.title}
      gameComponent={renderGameComponent()}
      instructions={gameConfig.instructions}
      customContent={customContent}
    />
  );
};

export default GamePage;
