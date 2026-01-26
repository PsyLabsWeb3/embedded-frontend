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

import { GameTypes } from "../types";

// Re-export types for convenience
export type GameAssets = GameTypes.UnityAssets;
export type GameConfig = GameTypes.GameConfig;

//GamePageImages
import embeddedWarsBackground from "../assets/gamesImages/EmbeddedWars.png?url";
import smugglersPoster from "../assets/gamesImages/SmugglersRun.png?url";
import snakeBackground from "../assets/gamesImages/EmbeddedSnake.png?url";
import asteroidsBackground from "../assets/gamesImages/Asteroids.png?url";
import cyberArenaBackground from "../assets/gamesImages/CyberArena.png?url";

/**
 * Snake2048 Unity WebGL Assets Configuration
 *
 * These assets are loaded using Vite's explicit URL imports to ensure
 * proper bundling and asset optimization. The ?url suffix tells Vite
 * to return the asset URL rather than importing the file content.
 */

import asteroidsLoaderUrl from "../assets/Unity/Asteroids/Build/Asteroids.loader.js?url";
import asteroidsDataUrl from "../assets/Unity/Asteroids/Build/Asteroids.data?url";
import asteroidsFrameworkUrl from "../assets/Unity/Asteroids/Build/Asteroids.framework.js?url";
import asteroidsCodeUrl from "../assets/Unity/Asteroids/Build/Asteroids.wasm?url";

const asteroidsAssets: GameAssets = {
  loaderUrl: asteroidsLoaderUrl,
  dataUrl: asteroidsDataUrl,
  frameworkUrl: asteroidsFrameworkUrl,
  codeUrl: asteroidsCodeUrl,
};

import embeddedWarsLoaderUrl from "../assets/Unity/EmbeddedWars/Build/EM-35-EmbeddedWars.loader.js?url";
import embeddedWarsDataUrl from "../assets/Unity/EmbeddedWars/Build/EM-35-EmbeddedWars.data?url";
import embeddedWarsFrameworkUrl from "../assets/Unity/EmbeddedWars/Build/EM-35-EmbeddedWars.framework.js?url";
import embeddedWarsCodeUrl from "../assets/Unity/EmbeddedWars/Build/EM-35-EmbeddedWars.wasm?url";

const embeddedWarsAssets: GameAssets = {
  loaderUrl: embeddedWarsLoaderUrl,
  dataUrl: embeddedWarsDataUrl,
  frameworkUrl: embeddedWarsFrameworkUrl,
  codeUrl: embeddedWarsCodeUrl,
};

import embeddedSpaceRaceLoaderUrl from "../assets/Unity/EmbeddedSpaceRace/Build/EmbeddedSpaceRace.loader.js?url";
import embeddedSpaceRaceDataUrl from "../assets/Unity/EmbeddedSpaceRace/Build/EmbeddedSpaceRace.data?url";
import embeddedSpaceRaceFrameworkUrl from "../assets/Unity/EmbeddedSpaceRace/Build/EmbeddedSpaceRace.framework.js?url";
import embeddedSpaceRaceCodeUrl from "../assets/Unity/EmbeddedSpaceRace/Build/EmbeddedSpaceRace.wasm?url";

const embeddedSpaceRaceAssets: GameAssets = {
  loaderUrl: embeddedSpaceRaceLoaderUrl,
  dataUrl: embeddedSpaceRaceDataUrl,
  frameworkUrl: embeddedSpaceRaceFrameworkUrl,
  codeUrl: embeddedSpaceRaceCodeUrl,
};

import embeddedSnakeLoaderUrl from "../assets/Unity/EmbeddedSnake/Build/EmbeddedSnake.loader.js?url";
import embeddedSnakeDataUrl from "../assets/Unity/EmbeddedSnake/Build/EmbeddedSnake.data.unityweb?url";
import embeddedSnakeFrameworkUrl from "../assets/Unity/EmbeddedSnake/Build/EmbeddedSnake.framework.js.unityweb?url";
import embeddedSnakeCodeUrl from "../assets/Unity/EmbeddedSnake/Build/EmbeddedSnake.wasm.unityweb?url";

const embeddedSnakeAssets: GameAssets = {
  loaderUrl: embeddedSnakeLoaderUrl,
  dataUrl: embeddedSnakeDataUrl,
  frameworkUrl: embeddedSnakeFrameworkUrl,
  codeUrl: embeddedSnakeCodeUrl,
};

import cyberarenaLoaderUrl from "../assets/Unity/CyberArena/Build/CyberArena.loader.js?url";
import cyberarenaDataUrl from "../assets/Unity/CyberArena/Build/CyberArena.data?url";
import cyberarenaFrameworkUrl from "../assets/Unity/CyberArena/Build/CyberArena.framework.js?url";
import cyberarenaCodeUrl from "../assets/Unity/CyberArena/Build/CyberArena.wasm?url";

const cyberArenaAssets: GameAssets = {
  loaderUrl: cyberarenaLoaderUrl,
  dataUrl: cyberarenaDataUrl,
  frameworkUrl: cyberarenaFrameworkUrl,
  codeUrl: cyberarenaCodeUrl,
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
  "01-embedded-snake": {
    id: "01-embedded-snake",
    title: "Embedded Snake",
    description:
      "Classic arcade game where players control a growing snake, collecting food to increase its length while avoiding collisions with walls and its own tail.",
    assets: embeddedSnakeAssets,
    backgroundImage: snakeBackground,
    category: GameTypes.GameCategory.ARCADE,
    difficulty: GameTypes.GameDifficulty.EASY,
    estimatedPlayTime: 5,
    isMultiplayer: false,
    minAge: 5,
    isPvE: true,
    instructions: [
      "Control the snake’s direction using swipe controls or arrow keys.",
      "Move the snake around the play area continuously.",
      "Eat the food that appears on the screen.",
      "Escape from bigger snakes.",
      "Use space bar or the button on mobile to speed up the snake.",
      "Grow longer each time food is collected.",
      "Survive as long as possible.",
    ],
  },

  "02-asteroids": {
    id: "02-asteroids",
    title: "Asteroids",
    description:
      "Pilot a lone star fighter through the endless void as waves of asteroids hurtle toward you. Dodge, spin, and fire with precision. Every rock you blast counts!",
    assets: asteroidsAssets,
    backgroundImage: asteroidsBackground,
    category: GameTypes.GameCategory.ARCADE,
    difficulty: GameTypes.GameDifficulty.EASY,
    estimatedPlayTime: 10,
    isMultiplayer: true,
    minAge: 6,
    // placeholder: true,
    instructions: [
      "Use arrow keys to control the ship",
      "Shoot the asteroids to destroy them",
      "Avoid hitting the asteroids",
      "Earn more points than your opponent!",
    ],
  },
  "03-Embedded-Wars": {
    id: "03-Embedded-Wars",
    title: "Embedded Wars",
    description: "PvP Sci-Fi 3rd person droid battle",
    longDescription:
      "In 2248, mega-corporations rule Earth, vying to control 'Aetherion', the rare fuel enabling faster-than-light travel. Synthesised using red mercury - found deep within certain planets - Aetherion fuels an interstellar economy. Smugglers, and five rival factions (mega-corporations) battle for dominance to control its supply and the interstellar economy. Embedded Wars takes place on a mining planet where these factions battle it out for control of resources.",
    assets: embeddedWarsAssets,
    backgroundImage: embeddedWarsBackground,
    category: GameTypes.GameCategory.PUZZLE,
    difficulty: GameTypes.GameDifficulty.EASY,
    estimatedPlayTime: 12,
    isMultiplayer: false,
    minAge: 5,
    instructions: [
      "Use arrow keys to move your drone",
      "Shoot projectiles with left click to eliminate enemies",
      "Avoid hitting with the laser",
      "Eliminate your opponent!",
    ],
  },
  "12-smugglers-run": {
    id: "12-smugglers-run",
    title: "Smugglers Run",
    description:
      "Fast paced kart racing game where players speed through colorful tracks, drifting around corners, using power ups to attack rivals or gain boosts, and racing to be the first to cross the finish line.",
    assets: embeddedSpaceRaceAssets,
    backgroundImage: smugglersPoster,
    category: GameTypes.GameCategory.RACING,
    difficulty: GameTypes.GameDifficulty.MEDIUM,
    estimatedPlayTime: 10,
    isMultiplayer: false,
    minAge: 5,
    isPvE: true,
    instructions: [
      "Choose your racer and ship.",
      "Use WASD or Joystick in mobile to control your ship.",
      "Press Shift to use your powerup.",
      "Drift around corners to maintain speed and gain boosts.",
      "Use collected power-ups to attack opponents or gain advantages.",
      "Complete all laps of the race.",
      "Win the race by crossing the finish line in first place.",
    ],
  },
  "13-cyber-arena": {
    id: "13-cyber-arena",
    title: "Cyber Arena",
    description:
      "Fast paced arena shooter where two players battle each other in a dynamic colosseum. Jump between platforms, dodge attacks, and use powerful guns to outshoot your opponent. Upgrade your weapons, master movement, and dominate the arena in intense one-on-one combat.",
    assets: cyberArenaAssets,
    backgroundImage: cyberArenaBackground,
    category: GameTypes.GameCategory.ARCADE,
    difficulty: GameTypes.GameDifficulty.MEDIUM,
    estimatedPlayTime: 10,
    isMultiplayer: true,
    minAge: 6,
    isPvE: false,
    isFriendlyPvP: false,
    isFreeToPlay: true,
    instructions: [
      "Use arrow keys or joystick to move your character.",
      "Jump between platforms to avoid enemy fire.",
      "Use powerful guns to outshoot your opponent.",
      "Be the last player standing to win the match.",
    ],
  },
};

// Add Smugglers Run
// gameConfigs["12-smugglers-run"] = {
//   id: "12-smugglers-run",
//   title: "Smugglers Run",
//   description: "A fast-paced PvE racing adventure.",
//   assets: embeddedSpaceRaceAssets,
//   backgroundImage: smugglersPoster,
//   category: GameTypes.GameCategory.RACING,
//   difficulty: GameTypes.GameDifficulty.MEDIUM,
//   estimatedPlayTime: 10,
//   isMultiplayer: false,
//   minAge: 5,
//   isPvE: true,
//   instructions: [
//     "Use WASD to control your ship.",
//     "Press Shift to use your powerup.",
//     "Press R to backtrack.",
//     "Win by getting to the finish line faster than your opponents!",
//   ],
// };

// Add Embedded Snake
// gameConfigs["01-embedded-snake"] = {
//   id: "01-embedded-snake",
//   title: "Embedded Snake",
//   description:
//     "Classic arcade game where players control a growing snake, collecting food to increase its length while avoiding collisions with walls and its own tail.",
//   assets: embeddedSnakeAssets,
//   backgroundImage: snakeBackground,
//   category: GameTypes.GameCategory.ARCADE,
//   difficulty: GameTypes.GameDifficulty.EASY,
//   estimatedPlayTime: 5,
//   isMultiplayer: false,
//   minAge: 5,
//   isPvE: true,
//   instructions: [
//     "Use your cursor / finger to move the snake",
//     "Eat food with lower or equal numbers to grow longer",
//     "Avoid hitting walls, longer snakes or yourself",
//     "Survive as long as you can!",
//   ],
// };
