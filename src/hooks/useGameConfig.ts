/**
 * @fileoverview Game Configuration Hooks
 * 
 * Custom React hooks for accessing and managing game configurations.
 * These hooks provide a clean interface for components to interact with
 * game data while maintaining type safety and performance optimization.
 * 
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

import { useMemo } from 'react';
import { gameConfigs } from '../config/gameConfigs';
import type { GameConfig } from '../config/gameConfigs';
import { GameTypes } from '../types';

/**
 * Hook to retrieve a specific game configuration by ID
 * 
 * @param gameId - The unique identifier for the game
 * @returns The game configuration object or null if not found
 * 
 * @example
 * ```tsx
 * const MyComponent = ({ gameId }: { gameId: string }) => {
 *   const gameConfig = useGameConfig(gameId);
 *   
 *   if (!gameConfig) {
 *     return <div>Game not found</div>;
 *   }
 *   
 *   return <div>{gameConfig.title}</div>;
 * };
 * ```
 */
export const useGameConfig = (gameId: string): GameConfig | null => {
  return useMemo(() => {
    return gameConfigs[gameId] || null;
  }, [gameId]);
};

/**
 * Hook to retrieve all game configurations
 * 
 * @returns A record of all game configurations indexed by game ID
 * 
 * @example
 * ```tsx
 * const GameList = () => {
 *   const allGames = useAllGameConfigs();
 *   
 *   return (
 *     <div>
 *       {Object.values(allGames).map(game => (
 *         <div key={game.id}>{game.title}</div>
 *       ))}
 *     </div>
 *   );
 * };
 * ```
 */
export const useAllGameConfigs = (): Record<string, GameConfig> => {
  return useMemo(() => gameConfigs, []);
};

/**
 * Hook to check if a game exists in the configuration
 * 
 * @param gameId - The unique identifier for the game
 * @returns True if the game exists, false otherwise
 * 
 * @example
 * ```tsx
 * const GameChecker = ({ gameId }: { gameId: string }) => {
 *   const gameExists = useGameExists(gameId);
 *   
 *   return (
 *     <div>
 *       Game {gameId} {gameExists ? 'exists' : 'does not exist'}
 *     </div>
 *   );
 * };
 * ```
 */
export const useGameExists = (gameId: string): boolean => {
  return useMemo(() => {
    return gameId in gameConfigs;
  }, [gameId]);
};

/**
 * Hook to get filtered games based on specific criteria
 * 
 * @param options - Filter options for games
 * @returns Array of game configurations matching the filter criteria
 * 
 * @example
 * ```tsx
 * const FeaturedGames = () => {
 *   const puzzleGames = useFilteredGames({ 
 *     category: GameTypes.GameCategory.PUZZLE,
 *     excludePlaceholders: true 
 *   });
 *   
 *   return (
 *     <div>
 *       {puzzleGames.map(game => (
 *         <div key={game.id}>{game.title}</div>
 *       ))}
 *     </div>
 *   );
 * };
 * ```
 */
export const useFilteredGames = (options: {
  category?: GameTypes.GameCategory;
  difficulty?: GameTypes.GameDifficulty;
  excludePlaceholders?: boolean;
  isMultiplayer?: boolean;
} = {}): GameConfig[] => {
  return useMemo(() => {
    const allGames = Object.values(gameConfigs);
    
    return allGames.filter(game => {
      // Filter by category if specified
      if (options.category && game.category !== options.category) {
        return false;
      }
      
      // Filter by difficulty if specified
      if (options.difficulty && game.difficulty !== options.difficulty) {
        return false;
      }
      
      // Exclude placeholders if requested
      if (options.excludePlaceholders && game.placeholder) {
        return false;
      }
      
      // Filter by multiplayer status if specified
      if (options.isMultiplayer !== undefined && game.isMultiplayer !== options.isMultiplayer) {
        return false;
      }
      
      return true;
    });
  }, [options.category, options.difficulty, options.excludePlaceholders, options.isMultiplayer]);
};

/**
 * Hook to get available (non-placeholder) games
 * 
 * @returns Array of game configurations that are ready to play
 */
export const useAvailableGames = (): GameConfig[] => {
  return useFilteredGames({ excludePlaceholders: true });
};

/**
 * Hook to get placeholder games (coming soon)
 * 
 * @returns Array of game configurations that are placeholders
 */
export const useComingSoonGames = (): GameConfig[] => {
  return useMemo(() => {
    return Object.values(gameConfigs).filter(game => game.placeholder);
  }, []);
};
