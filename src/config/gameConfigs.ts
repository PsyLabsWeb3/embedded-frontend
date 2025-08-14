/**
 * @fileoverview Game Configuration Registry
 * 
 * This file manages all game configurations for the platform, including
 * Unity WebGL assets, game metadata, and placeholder configurations.
 * Each game must be registered here to be accessible through the application.
 * 
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

import { GameTypes } from '../types';

// Re-export types for convenience
export type GameAssets = GameTypes.UnityAssets;
export type GameConfig = GameTypes.GameConfig;

/**
 * Snake2048 Unity WebGL Assets Configuration
 * 
 * These assets are loaded using Vite's explicit URL imports to ensure
 * proper bundling and asset optimization. The ?url suffix tells Vite
 * to return the asset URL rather than importing the file content.
 */
import snake2048LoaderUrl from '../assets/Unity/Snake2048/Build/Snake2048webgl.loader.js?url';
import snake2048DataUrl from '../assets/Unity/Snake2048/Build/Snake2048webgl.data.unityweb?url';
import snake2048FrameworkUrl from '../assets/Unity/Snake2048/Build/Snake2048webgl.framework.js.unityweb?url';
import snake2048CodeUrl from '../assets/Unity/Snake2048/Build/Snake2048webgl.wasm.unityweb?url';

const snake2048Assets: GameAssets = {
  loaderUrl: snake2048LoaderUrl,
  dataUrl: snake2048DataUrl,
  frameworkUrl: snake2048FrameworkUrl,
  codeUrl: snake2048CodeUrl,
};

import pingPongLoaderUrl from '../assets/Unity/PingPong/Build/EM-17-PingPong.loader.js?url';
import pingPongDataUrl from '../assets/Unity/PingPong/Build/EM-17-PingPong.data?url';
import pingPongFrameworkUrl from '../assets/Unity/PingPong/Build/EM-17-PingPong.framework.js?url';
import pingPongCodeUrl from '../assets/Unity/PingPong/Build/EM-17-PingPong.wasm?url';

const pingPongAssets: GameAssets = {
  loaderUrl: pingPongLoaderUrl,
  dataUrl: pingPongDataUrl,
  frameworkUrl: pingPongFrameworkUrl,
  codeUrl: pingPongCodeUrl,
};

import embeddedWarsLoaderUrl from '../assets/Unity/EmbeddedWars/Build/EM-35-EmbeddedWars.loader.js?url';
import embeddedWarsDataUrl from '../assets/Unity/EmbeddedWars/Build/EM-35-EmbeddedWars.data?url';
import embeddedWarsFrameworkUrl from '../assets/Unity/EmbeddedWars/Build/EM-35-EmbeddedWars.framework.js?url';
import embeddedWarsCodeUrl from '../assets/Unity/EmbeddedWars/Build/EM-35-EmbeddedWars.wasm?url';

const embeddedWarsAssets: GameAssets = {
  loaderUrl: embeddedWarsLoaderUrl,
  dataUrl: embeddedWarsDataUrl,
  frameworkUrl: embeddedWarsFrameworkUrl,
  codeUrl: embeddedWarsCodeUrl,
};


/**
 * Future Game Assets Template
 * 
 * When adding new Unity games, follow this pattern for asset configuration:
 * 
 * const newGameAssets: GameAssets = {
 *   loaderUrl: new URL('../../assets/Unity/NewGame/Build/NewGame.loader.js', import.meta.url).href,
 *   dataUrl: new URL('../../assets/Unity/NewGame/Build/NewGame.data.unityweb', import.meta.url).href,
 *   frameworkUrl: new URL('../../assets/Unity/NewGame/Build/NewGame.framework.js.unityweb', import.meta.url).href,
 *   codeUrl: new URL('../../assets/Unity/NewGame/Build/NewGame.wasm.unityweb', import.meta.url).href,
 * };
 * 
 * Or use Vite's ?url imports for explicit URL handling:
 * 
 * import loaderUrl from '../assets/Unity/NewGame/Build/NewGame.loader.js?url';
 * import dataUrl from '../assets/Unity/NewGame/Build/NewGame.data.unityweb?url';
 * import frameworkUrl from '../assets/Unity/NewGame/Build/NewGame.framework.js.unityweb?url';
 * import codeUrl from '../assets/Unity/NewGame/Build/NewGame.wasm.unityweb?url';
 */

/**
 * Centralized game configurations registry
 * 
 * This object contains all game configurations indexed by their unique IDs.
 * Each game can either have actual Unity assets or be marked as a placeholder
 * for future implementation. The configuration supports:
 * 
 * - Unity WebGL asset loading
 * - Game instructions and metadata
 * - Placeholder states for unreleased games
 * - Consistent routing and identification
 */
export const gameConfigs: Record<string, GameConfig> = {
  // Production Games
  '01-snake': {
    id: '01-snake',
    title: 'Snake Game',
    description: 'Classic snake game with number merging mechanics',
    assets: snake2048Assets,
    category: GameTypes.GameCategory.PUZZLE,
    difficulty: GameTypes.GameDifficulty.MEDIUM,
    estimatedPlayTime: 15,
    isMultiplayer: false,
    minAge: 8,
    instructions: [
      'Use arrow keys to move the snake',
      'Combine equal numbers to create larger numbers',
      'Avoid hitting walls or yourself',
      'Try to reach the number 2048!'
    ]
  },

  // Placeholder Games - These will be implemented in future releases
  '02-ping-pong': {
    id: '02-ping-pong',
    title: 'Ping Pong',
    description: 'Fast-paced table tennis game',
    assets: pingPongAssets,
    category: GameTypes.GameCategory.ARCADE,
    difficulty: GameTypes.GameDifficulty.EASY,
    estimatedPlayTime: 10,
    isMultiplayer: true,
    minAge: 6,
    // placeholder: true,
    instructions: [
      'Use arrow keys to move the snake',
      'Combine equal numbers to create larger numbers',
      'Avoid hitting walls or yourself',
      'Try to reach the number 2048!'
    ]
  },
  '03-Embedded-Wars': {
    id: '03-Embedded-Wars',
    title: 'Embedded-Wars',
    description: 'PvP Sci-Fi 3rd person droid battle',
    assets: embeddedWarsAssets,
    category: GameTypes.GameCategory.PUZZLE,
    difficulty: GameTypes.GameDifficulty.EASY,
    estimatedPlayTime: 12,
    isMultiplayer: false,
    minAge: 5,
  
  },
  '04-candy-sweet': {
    id: '04-candy-sweet',
    title: 'Candy Sweet',
    description: 'Match sweet candies in this delightful puzzle game',
    category: GameTypes.GameCategory.PUZZLE,
    difficulty: GameTypes.GameDifficulty.MEDIUM,
    estimatedPlayTime: 20,
    isMultiplayer: false,
    minAge: 7,
    placeholder: true
  },
  '05-sort-puzzle': {
    id: '05-sort-puzzle',
    title: 'Sort Puzzle',
    description: 'Organize and sort elements to solve challenging puzzles',
    category: GameTypes.GameCategory.PUZZLE,
    difficulty: GameTypes.GameDifficulty.HARD,
    estimatedPlayTime: 25,
    isMultiplayer: false,
    minAge: 10,
    placeholder: true
  },
  '06-pipes-flood': {
    id: '06-pipes-flood',
    title: 'Pipes Flood',
    description: 'Connect pipes to prevent flooding in this strategy game',
    category: GameTypes.GameCategory.STRATEGY,
    difficulty: GameTypes.GameDifficulty.MEDIUM,
    estimatedPlayTime: 18,
    isMultiplayer: false,
    minAge: 9,
    placeholder: true
  },
  '07-hover-racer': {
    id: '07-hover-racer',
    title: 'Hover Racer',
    description: 'High-speed racing with futuristic hover vehicles',
    category: GameTypes.GameCategory.ACTION,
    difficulty: GameTypes.GameDifficulty.HARD,
    estimatedPlayTime: 30,
    isMultiplayer: true,
    minAge: 12,
    placeholder: true
  },
  '08-infinite-runner': {
    id: '08-infinite-runner',
    title: 'Infinite Runner',
    description: 'Endless running adventure with obstacles and power-ups',
    category: GameTypes.GameCategory.ARCADE,
    difficulty: GameTypes.GameDifficulty.MEDIUM,
    estimatedPlayTime: 15,
    isMultiplayer: false,
    minAge: 8,
    placeholder: true
  },
  '09-cake-mania': {
    id: '09-cake-mania',
    title: 'Cake Mania',
    description: 'Manage a busy bakery in this time management game',
    category: GameTypes.GameCategory.STRATEGY,
    difficulty: GameTypes.GameDifficulty.MEDIUM,
    estimatedPlayTime: 35,
    isMultiplayer: false,
    minAge: 10,
    placeholder: true
  },
  '10-game-10': {
    id: '10-game-10',
    title: 'Game 10',
    description: 'Exciting new game coming soon',
    category: GameTypes.GameCategory.CASUAL,
    difficulty: GameTypes.GameDifficulty.EASY,
    estimatedPlayTime: 10,
    isMultiplayer: false,
    minAge: 6,
    placeholder: true
  },
  '11-game-11': {
    id: '11-game-11',
    title: 'Game 11',
    description: 'Another exciting game in development',
    category: GameTypes.GameCategory.CASUAL,
    difficulty: GameTypes.GameDifficulty.EASY,
    estimatedPlayTime: 10,
    isMultiplayer: false,
    minAge: 6,
    placeholder: true
  }
};
