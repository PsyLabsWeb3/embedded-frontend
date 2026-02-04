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
import tankieRacerAttackBackground from "../assets/gamesImages/TankieRacerAttack.png?url";
import endlessRunnerBackground from "../assets/gamesImages/EndlessRunner.png?url";
import guerreroMayaBackground from "../assets/gamesImages/GuerreroMaya.png?url";
import donutMatch from "../assets/gamesImages/DonutMatch.png?url";
import topDownShooterImage from "../assets/gamesImages/TopDownShooter.png?url";
import ballSliceImage from "../assets/gamesImages/Slice.png?url";
import underwaterAdventureImage from "../assets/gamesImages/UnderwaterAdventure.png?url";
import zigzagEndlessRunnerImage from "../assets/gamesImages/ZigZagEndlessRunner.png?url";
import roundBallImage from "../assets/gamesImages/RoundBall.png?url";
import crazyBallImage from "../assets/gamesImages/CrazyBall.png?url";
import swipeGameImage from "../assets/gamesImages/SwipeGame.png?url";
import colorCatchImage from "../assets/gamesImages/ColorCatch.png?url";
import skyHover from "../assets/gamesImages/SkyHover.png?url";
import stackBreakerImage from "../assets/gamesImages/StackBreaker.png?url";
import jumpSkyImage from "../assets/gamesImages/JumpSky.png?url";
import downhillRushImage from "../assets/gamesImages/DownhillRush.png?url";
import mazeRotatorImage from "../assets/gamesImages/MazeRotator.png?url";
import smashyBallImage from "../assets/gamesImages/SmashyBall.png?url";
import hoppyRampageImage from "../assets/gamesImages/HoppyRampage.png?url";

/**
 * GAMES UNITY ASSETS CONFIGURATION
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

import embeddedSpaceRaceLoaderUrl from "../assets/Unity/SmugglersRun/Build/SmugglersRun.loader.js?url";
import embeddedSpaceRaceDataUrl from "../assets/Unity/SmugglersRun/Build/SmugglersRun.data?url";
import embeddedSpaceRaceFrameworkUrl from "../assets/Unity/SmugglersRun/Build/SmugglersRun.framework.js?url";
import embeddedSpaceRaceCodeUrl from "../assets/Unity/SmugglersRun/Build/SmugglersRun.wasm?url";

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

import donutMatchLoaderUrl from "../assets/Unity/DonutMatch/Build/DonutMatch.loader.js?url";
import donutMatchDataUrl from "../assets/Unity/DonutMatch/Build/DonutMatch.data?url";
import donutMatchFrameworkUrl from "../assets/Unity/DonutMatch/Build/DonutMatch.framework.js?url";
import donutMatchCodeUrl from "../assets/Unity/DonutMatch/Build/DonutMatch.wasm?url";

const donutMatchAssets: GameAssets = {
  loaderUrl: donutMatchLoaderUrl,
  dataUrl: donutMatchDataUrl,
  frameworkUrl: donutMatchFrameworkUrl,
  codeUrl: donutMatchCodeUrl,
};

import ballSliceLoaderUrl from "../assets/Unity/BallSlice/Build/BallSlice.loader.js?url";
import ballSliceDataUrl from "../assets/Unity/BallSlice/Build/BallSlice.data?url";
import ballSliceFrameworkUrl from "../assets/Unity/BallSlice/Build/BallSlice.framework.js?url";
import ballSliceCodeUrl from "../assets/Unity/BallSlice/Build/BallSlice.wasm?url";

const ballSliceAssets: GameAssets = {
  loaderUrl: ballSliceLoaderUrl,
  dataUrl: ballSliceDataUrl,
  frameworkUrl: ballSliceFrameworkUrl,
  codeUrl: ballSliceCodeUrl,
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

import tankieRacerAttackLoaderUrl from "../assets/Unity/TankieRacerAttack/Build/TankieRacerAttack.loader.js?url";
import tankieRacerAttackDataUrl from "../assets/Unity/TankieRacerAttack/Build/TankieRacerAttack.data?url";
import tankieRacerAttackFrameworkUrl from "../assets/Unity/TankieRacerAttack/Build/TankieRacerAttack.framework.js?url";
import tankieRacerAttackCodeUrl from "../assets/Unity/TankieRacerAttack/Build/TankieRacerAttack.wasm?url";

const tankieRacerAttackAssets: GameAssets = {
  loaderUrl: tankieRacerAttackLoaderUrl,
  dataUrl: tankieRacerAttackDataUrl,
  frameworkUrl: tankieRacerAttackFrameworkUrl,
  codeUrl: tankieRacerAttackCodeUrl,
};

import endlessRunnerLoaderUrl from "../assets/Unity/EndlessRunner/Build/EndlessRunner.loader.js?url";
import endlessRunnerDataUrl from "../assets/Unity/EndlessRunner/Build/EndlessRunner.data?url";
import endlessRunnerFrameworkUrl from "../assets/Unity/EndlessRunner/Build/EndlessRunner.framework.js?url";
import endlessRunnerCodeUrl from "../assets/Unity/EndlessRunner/Build/EndlessRunner.wasm?url";

const endlessRunnerAssets: GameAssets = {
  loaderUrl: endlessRunnerLoaderUrl,
  dataUrl: endlessRunnerDataUrl,
  frameworkUrl: endlessRunnerFrameworkUrl,
  codeUrl: endlessRunnerCodeUrl,
};

import guerreroMayaLoaderUrl from "../assets/Unity/GuerreroMayaPvE/Build/GuerreroMayaPvE.loader.js?url";
import guerreroMayaDataUrl from "../assets/Unity/GuerreroMayaPvE/Build/GuerreroMayaPvE.data?url";
import guerreroMayaFrameworkUrl from "../assets/Unity/GuerreroMayaPvE/Build/GuerreroMayaPvE.framework.js?url";
import guerreroMayaCodeUrl from "../assets/Unity/GuerreroMayaPvE/Build/GuerreroMayaPvE.wasm?url";

const guerreroMayaAssets: GameAssets = {
  loaderUrl: guerreroMayaLoaderUrl,
  dataUrl: guerreroMayaDataUrl,
  frameworkUrl: guerreroMayaFrameworkUrl,
  codeUrl: guerreroMayaCodeUrl,
};

import topDownShooterLoaderUrl from "../assets/Unity/TopDownShooter/Build/TopDownShooter.loader.js?url";
import topDownShooterDataUrl from "../assets/Unity/TopDownShooter/Build/TopDownShooter.data?url";
import topDownShooterFrameworkUrl from "../assets/Unity/TopDownShooter/Build/TopDownShooter.framework.js?url";
import topDownShooterCodeUrl from "../assets/Unity/TopDownShooter/Build/TopDownShooter.wasm?url";

const topDownShooterAssets: GameAssets = {
  loaderUrl: topDownShooterLoaderUrl,
  dataUrl: topDownShooterDataUrl,
  frameworkUrl: topDownShooterFrameworkUrl,
  codeUrl: topDownShooterCodeUrl,
};

import underwaterAdventureLoaderUrl from "../assets/Unity/UnderwaterAdventure/Build/UnderwaterAdventure.loader.js?url";
import underwaterAdventureDataUrl from "../assets/Unity/UnderwaterAdventure/Build/UnderwaterAdventure.data?url";
import underwaterAdventureFrameworkUrl from "../assets/Unity/UnderwaterAdventure/Build/UnderwaterAdventure.framework.js?url";
import underwaterAdventureCodeUrl from "../assets/Unity/UnderwaterAdventure/Build/UnderwaterAdventure.wasm?url";

const underwaterAdventureAssets: GameAssets = {
  loaderUrl: underwaterAdventureLoaderUrl,
  dataUrl: underwaterAdventureDataUrl,
  frameworkUrl: underwaterAdventureFrameworkUrl,
  codeUrl: underwaterAdventureCodeUrl,
};

import zigzagEndlessRunnerLoaderUrl from "../assets/Unity/ZigZagEndlessRunner/Build/ZigZagEndlessRunner.loader.js?url";
import zigzagEndlessRunnerDataUrl from "../assets/Unity/ZigZagEndlessRunner/Build/ZigZagEndlessRunner.data?url";
import zigzagEndlessRunnerFrameworkUrl from "../assets/Unity/ZigZagEndlessRunner/Build/ZigZagEndlessRunner.framework.js?url";
import zigzagEndlessRunnerCodeUrl from "../assets/Unity/ZigZagEndlessRunner/Build/ZigZagEndlessRunner.wasm?url";

const zigzagEndlessRunnerAssets: GameAssets = {
  loaderUrl: zigzagEndlessRunnerLoaderUrl,
  dataUrl: zigzagEndlessRunnerDataUrl,
  frameworkUrl: zigzagEndlessRunnerFrameworkUrl,
  codeUrl: zigzagEndlessRunnerCodeUrl,
};

import roundBallLoaderUrl from "../assets/Unity/RoundBall/Build/RoundBall.loader.js?url";
import roundBallDataUrl from "../assets/Unity/RoundBall/Build/RoundBall.data?url";
import roundBallFrameworkUrl from "../assets/Unity/RoundBall/Build/RoundBall.framework.js?url";
import roundBallCodeUrl from "../assets/Unity/RoundBall/Build/RoundBall.wasm?url";

const roundBallAssets: GameAssets = {
  loaderUrl: roundBallLoaderUrl,
  dataUrl: roundBallDataUrl,
  frameworkUrl: roundBallFrameworkUrl,
  codeUrl: roundBallCodeUrl,
};

import crazyBallLoaderUrl from "../assets/Unity/CrazyBall/Build/CrazyBall.loader.js?url";
import crazyBallDataUrl from "../assets/Unity/CrazyBall/Build/CrazyBall.data?url";
import crazyBallFrameworkUrl from "../assets/Unity/CrazyBall/Build/CrazyBall.framework.js?url";
import crazyBallCodeUrl from "../assets/Unity/CrazyBall/Build/CrazyBall.wasm?url";

const crazyBallAssets: GameAssets = {
  loaderUrl: crazyBallLoaderUrl,
  dataUrl: crazyBallDataUrl,
  frameworkUrl: crazyBallFrameworkUrl,
  codeUrl: crazyBallCodeUrl,
};

import swipeGameLoaderUrl from "../assets/Unity/SwipeGame/Build/SwipeGame.loader.js?url";
import swipeGameDataUrl from "../assets/Unity/SwipeGame/Build/SwipeGame.data?url";
import swipeGameFrameworkUrl from "../assets/Unity/SwipeGame/Build/SwipeGame.framework.js?url";
import swipeGameCodeUrl from "../assets/Unity/SwipeGame/Build/SwipeGame.wasm?url";

const swipeGameAssets: GameAssets = {
  loaderUrl: swipeGameLoaderUrl,
  dataUrl: swipeGameDataUrl,
  frameworkUrl: swipeGameFrameworkUrl,
  codeUrl: swipeGameCodeUrl,
};

import colorCatchLoaderUrl from "../assets/Unity/ColorCatch/Build/ColorCatch.loader.js?url";
import colorCatchDataUrl from "../assets/Unity/ColorCatch/Build/ColorCatch.data?url";
import colorCatchFrameworkUrl from "../assets/Unity/ColorCatch/Build/ColorCatch.framework.js?url";
import colorCatchCodeUrl from "../assets/Unity/ColorCatch/Build/ColorCatch.wasm?url";

const colorCatchAssets: GameAssets = {
  loaderUrl: colorCatchLoaderUrl,
  dataUrl: colorCatchDataUrl,
  frameworkUrl: colorCatchFrameworkUrl,
  codeUrl: colorCatchCodeUrl,
};

import skyHoverLoaderUrl from "../assets/Unity/SkyHover/Build/SkyHover.loader.js?url";
import skyHoverDataUrl from "../assets/Unity/SkyHover/Build/SkyHover.data?url";
import skyHoverFrameworkUrl from "../assets/Unity/SkyHover/Build/SkyHover.framework.js?url";
import skyHoverCodeUrl from "../assets/Unity/SkyHover/Build/SkyHover.wasm?url";

const skyHoverAssets: GameAssets = {
  loaderUrl: skyHoverLoaderUrl,
  dataUrl: skyHoverDataUrl,
  frameworkUrl: skyHoverFrameworkUrl,
  codeUrl: skyHoverCodeUrl,
};

import stackBreakerLoaderUrl from "../assets/Unity/StackBreaker/Build/StackBreaker.loader.js?url";
import stackBreakerDataUrl from "../assets/Unity/StackBreaker/Build/StackBreaker.data?url";
import stackBreakerFrameworkUrl from "../assets/Unity/StackBreaker/Build/StackBreaker.framework.js?url";
import stackBreakerCodeUrl from "../assets/Unity/StackBreaker/Build/StackBreaker.wasm?url";

const stackBreakerAssets: GameAssets = {
  loaderUrl: stackBreakerLoaderUrl,
  dataUrl: stackBreakerDataUrl,
  frameworkUrl: stackBreakerFrameworkUrl,
  codeUrl: stackBreakerCodeUrl,
};

import jumpSkyLoaderUrl from "../assets/Unity/JumpSky/Build/JumpSky.loader.js?url";
import jumpSkyDataUrl from "../assets/Unity/JumpSky/Build/JumpSky.data?url";
import jumpSkyFrameworkUrl from "../assets/Unity/JumpSky/Build/JumpSky.framework.js?url";
import jumpSkyCodeUrl from "../assets/Unity/JumpSky/Build/JumpSky.wasm?url";

const jumpSkyAssets: GameAssets = {
  loaderUrl: jumpSkyLoaderUrl,
  dataUrl: jumpSkyDataUrl,
  frameworkUrl: jumpSkyFrameworkUrl,
  codeUrl: jumpSkyCodeUrl,
};

import downhillRushLoaderUrl from "../assets/Unity/DownhillRush/Build/DownhillRush.loader.js?url";
import downhillRushDataUrl from "../assets/Unity/DownhillRush/Build/DownhillRush.data?url";
import downhillRushFrameworkUrl from "../assets/Unity/DownhillRush/Build/DownhillRush.framework.js?url";
import downhillRushCodeUrl from "../assets/Unity/DownhillRush/Build/DownhillRush.wasm?url";

const downhillRushAssets: GameAssets = {
  loaderUrl: downhillRushLoaderUrl,
  dataUrl: downhillRushDataUrl,
  frameworkUrl: downhillRushFrameworkUrl,
  codeUrl: downhillRushCodeUrl,
};

import mazeRotatorLoaderUrl from "../assets/Unity/MazeRotator/Build/MazeRotator.loader.js?url";
import mazeRotatorDataUrl from "../assets/Unity/MazeRotator/Build/MazeRotator.data?url";
import mazeRotatorFrameworkUrl from "../assets/Unity/MazeRotator/Build/MazeRotator.framework.js?url";
import mazeRotatorCodeUrl from "../assets/Unity/MazeRotator/Build/MazeRotator.wasm?url";

const mazeRotatorAssets: GameAssets = {
  loaderUrl: mazeRotatorLoaderUrl,
  dataUrl: mazeRotatorDataUrl,
  frameworkUrl: mazeRotatorFrameworkUrl,
  codeUrl: mazeRotatorCodeUrl,
};

import smashyBallLoaderUrl from "../assets/Unity/SmashyBall/Build/SmashyBall.loader.js?url";
import smashyBallDataUrl from "../assets/Unity/SmashyBall/Build/SmashyBall.data?url";
import smashyBallFrameworkUrl from "../assets/Unity/SmashyBall/Build/SmashyBall.framework.js?url";
import smashyBallCodeUrl from "../assets/Unity/SmashyBall/Build/SmashyBall.wasm?url";

const smashyBallAssets: GameAssets = {
  loaderUrl: smashyBallLoaderUrl,
  dataUrl: smashyBallDataUrl,
  frameworkUrl: smashyBallFrameworkUrl,
  codeUrl: smashyBallCodeUrl,
};

import hoppyRampageLoaderUrl from "../assets/Unity/HoppyRampage/Build/HoppyRampage.loader.js?url";
import hoppyRampageDataUrl from "../assets/Unity/HoppyRampage/Build/HoppyRampage.data?url";
import hoppyRampageFrameworkUrl from "../assets/Unity/HoppyRampage/Build/HoppyRampage.framework.js?url";
import hoppyRampageCodeUrl from "../assets/Unity/HoppyRampage/Build/HoppyRampage.wasm?url";

const hoppyRampageAssets: GameAssets = {
  loaderUrl: hoppyRampageLoaderUrl,
  dataUrl: hoppyRampageDataUrl,
  frameworkUrl: hoppyRampageFrameworkUrl,
  codeUrl: hoppyRampageCodeUrl,
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
    minEntryFee: 0.1,
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
    minEntryFee: 0.5,
    isPvP: true,
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
    minEntryFee: 0.5,
    isPvP: true,
    instructions: [
      "Use arrow keys to move your drone",
      "Shoot projectiles with left click to eliminate enemies",
      "Avoid hitting with the laser",
      "Eliminate your opponent!",
    ],
  },
  "04-donut-match": {
    id: "04-donut-match",
    title: "Donut Match",
    description:
      "Fun and addictive match-3 puzzle game where players swap colorful donuts to create matches of three or more, clearing them from the board and earning points.",
    assets: donutMatchAssets,
    backgroundImage: donutMatch,
    category: GameTypes.GameCategory.PUZZLE,
    difficulty: GameTypes.GameDifficulty.EASY,
    estimatedPlayTime: 5,
    isMultiplayer: false,
    minAge: 5,
    minEntryFee: 0,
    isFreeToPlay: true,
    instructions: [
      "Swap adjacent donuts to create a line of three or more matching donuts.",
      "Matched donuts will be cleared from the board, earning you points.",
      "Use power-ups to clear larger sections of the board.",
      "Complete the level objectives to advance to the next stage.",
    ],
  },
  "05-ball-slice": {
    id: "05-ball-slice",
    title: "Ball Slice",
    description:
      "Exciting slicing game where players use quick reflexes to slice through flying balls while avoiding bombs, aiming for high scores and combos.",
    assets: ballSliceAssets,
    backgroundImage: ballSliceImage,
    category: GameTypes.GameCategory.ARCADE,
    difficulty: GameTypes.GameDifficulty.EASY,
    estimatedPlayTime: 5,
    isMultiplayer: false,
    minAge: 5,
    minEntryFee: 0,
    isFreeToPlay: true,
    instructions: [
      "Swipe across the screen to slice the balls.",
      "Avoid slicing bombs to prevent losing points.",
      "Aim for combos by slicing multiple balls in one swipe.",
      "Try to achieve the highest score possible.",
    ],
  },
  "06-underwater-adventure": {
    id: "06-underwater-adventure",
    title: "Underwater Adventure",
    description:
      "Endless runner underwater world, dodging obstacles, collecting treasures, and exploring the depths of the ocean.",
    assets: underwaterAdventureAssets,
    backgroundImage: underwaterAdventureImage,
    category: GameTypes.GameCategory.ARCADE,
    difficulty: GameTypes.GameDifficulty.EASY,
    estimatedPlayTime: 5,
    isMultiplayer: false,
    minAge: 5,
    minEntryFee: 0,
    isFreeToPlay: true,
    instructions: [
      "Use arrow keys or swipe controls to jump over obstacles.",
      "Collect treasures along the way to increase your score.",
      "Avoid hitting obstacles to keep swimming.",
      "Aim for the highest score possible.",
    ],
  },
  "07-zigzag-endless-runner": {
    id: "07-zigzag-endless-runner",
    title: "ZigZag Endless Runner",
    description:
      "Navigate a zigzag path in this endless runner, avoiding obstacles and collecting power-ups to achieve the highest score possible.",
    assets: zigzagEndlessRunnerAssets,
    backgroundImage: zigzagEndlessRunnerImage,
    category: GameTypes.GameCategory.ARCADE,
    difficulty: GameTypes.GameDifficulty.EASY,
    estimatedPlayTime: 5,
    isMultiplayer: false,
    minAge: 5,
    minEntryFee: 0,
    isFreeToPlay: true,
    instructions: [
      "Use arrow keys or swipe controls to navigate the zigzag path.",
      "Avoid obstacles to keep running.",
      "Collect power-ups along the way to boost your score.",
      "Aim for the highest score possible.",
    ],
  },
  "08-round-ball": {
    id: "08-round-ball",
    title: "Round Ball",
    description:
      "3D rolling ball game where players navigate a spherical character through dynamic environments, overcoming obstacles and collecting items to reach the finish line.",
    assets: roundBallAssets,
    backgroundImage: roundBallImage,
    category: GameTypes.GameCategory.ARCADE,
    difficulty: GameTypes.GameDifficulty.EASY,
    estimatedPlayTime: 5,
    isMultiplayer: false,
    minAge: 5,
    minEntryFee: 0,
    isFreeToPlay: true,
    instructions: [
      "Use arrow keys or swipe controls to roll the ball.",
      "Navigate through dynamic environments.",
      "Overcome obstacles and collect items.",
      "Reach the finish line to complete the level.",
    ],
  },
  "09-crazy-ball": {
    id: "09-crazy-ball",
    title: "Crazy Ball",
    description:
      "Control a rolling ball through dynamic levels, avoiding obstacles, collecting rewards, and testing their reflexes as the speed and challenge increase.",
    assets: crazyBallAssets,
    backgroundImage: crazyBallImage,
    category: GameTypes.GameCategory.ARCADE,
    difficulty: GameTypes.GameDifficulty.EASY,
    estimatedPlayTime: 5,
    isMultiplayer: false,
    minAge: 5,
    minEntryFee: 0,
    isFreeToPlay: true,
    instructions: [
      "Use arrow keys or swipe controls to roll the ball.",
      "Navigate through dynamic environments.",
      "Overcome obstacles and collect items.",
      "Reach the finish line to complete the level.",
    ],
  },
  "10-swipe-game": {
    id: "10-swipe-game",
    title: "Swipe Game",
    description:
      "Move a character around the screen to collect points while carefully avoiding dangerous black dots, testing quick reflexes and precise movement.",
    assets: swipeGameAssets,
    backgroundImage: swipeGameImage,
    category: GameTypes.GameCategory.ARCADE,
    difficulty: GameTypes.GameDifficulty.EASY,
    estimatedPlayTime: 5,
    isMultiplayer: false,
    minAge: 5,
    minEntryFee: 0,
    isFreeToPlay: true,
    instructions: [
      "Swipe in the direction of the on-screen arrows.",
      "Match as many arrows as possible within the time limit.",
      "Avoid incorrect swipes to maintain your score.",
      "Aim for the highest score possible.",
    ],
  },
  "11-color-catch": {
    id: "11-color-catch",
    title: "Color Catch",
    description:
      "Players rotate an object left or right to collect balls of the matching color while avoiding balls of different colors, testing timing, focus, and quick reactions.",
    assets: colorCatchAssets,
    backgroundImage: colorCatchImage,
    category: GameTypes.GameCategory.ARCADE,
    difficulty: GameTypes.GameDifficulty.EASY,
    estimatedPlayTime: 5,
    isMultiplayer: false,
    minAge: 5,
    minEntryFee: 0,
    isFreeToPlay: true,
    instructions: [
      "On mobile devices, touch the left or right side of the screen to rotate in that direction.",
      "Rotate carefully to control the game object.",
      "Collect only the balls that match your current color.",
      "Avoid collecting balls of a different color.",
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
    minEntryFee: 0.1,
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
    minEntryFee: 0.1,
    isPvE: false,
    isFriendlyPvP: true,
    isFreeToPlay: true,
    instructions: [
      "Use arrow keys or joystick to move your character.",
      "Jump between platforms to avoid enemy fire.",
      "Use powerful guns to outshoot your opponent.",
      "Be the last player standing to win the match.",
    ],
  },
  "14-tankie-racer-attack": {
    id: "14-tankie-racer-attack",
    title: "Tankie Racer Attack",
    description:
      "Endless tank racing game where you steer left or right on a zigzag track, race against enemy tanks, dodge obstacles, and battle your way through action-packed levels.",
    assets: tankieRacerAttackAssets,
    backgroundImage: tankieRacerAttackBackground,
    category: GameTypes.GameCategory.RACING,
    difficulty: GameTypes.GameDifficulty.MEDIUM,
    estimatedPlayTime: 10,
    isMultiplayer: false,
    minAge: 5,
    minEntryFee: 0.1,
    isPvE: true,
    isFreeToPlay: true,
    instructions: [
      "Use arrow keys or joystick to steer your tank left or right.",
      "Navigate the zigzag track without falling off.",
      "Race against enemy tanks and dodge obstacles.",
      "Reach the highest score possible by surviving longer.",
    ],
  },
  "15-endless-runner": {
    id: "15-endless-runner",
    title: "Endless Runner",
    description:
      "Endless runner game where players control a character running through a dynamic environment, jumping over obstacles, collecting coins, and aiming for the highest score possible.",
    assets: endlessRunnerAssets,
    backgroundImage: endlessRunnerBackground,
    category: GameTypes.GameCategory.ARCADE,
    difficulty: GameTypes.GameDifficulty.EASY,
    estimatedPlayTime: 5,
    isMultiplayer: false,
    minAge: 5,
    minEntryFee: 0.1,
    isPvE: true,
    isFreeToPlay: true,
    instructions: [
      "Use arrow keys or swipe controls to jump over obstacles.",
      "Collect coins along the way to increase your score.",
      "Avoid hitting obstacles to keep running.",
      "Aim for the highest score possible.",
    ],
  },
  "16-guerrero-maya": {
    id: "16-guerrero-maya",
    title: "Guerrero Maya",
    description:
      "2D tower defense. Defend the Mezcal temple, plant agave to generate energy, and deploy units fast as enemy waves accelerate. Upgrade, adapt, and survive the chaos.",
    assets: guerreroMayaAssets,
    backgroundImage: guerreroMayaBackground,
    category: GameTypes.GameCategory.ARCADE,
    difficulty: GameTypes.GameDifficulty.MEDIUM,
    estimatedPlayTime: 15,
    isMultiplayer: false,
    minAge: 7,
    minEntryFee: 0.1,
    isPvE: true,
    isFreeToPlay: true,
    instructions: [
      "Use arrow keys or joystick to move your warrior.",
      "Explore ancient temples and environments.",
      "Solve puzzles to unlock new areas.",
      "Overcome challenges to protect your civilization's secrets.",
    ],
  },
  "17-top-down-shooter": {
    id: "17-top-down-shooter",
    title: "Top Down Shooter",
    description:
      "Fast paced action game where players battle each other from a top-down view, using skill, strategy, in intense multiplayer arenas.",
    assets: topDownShooterAssets,
    backgroundImage: topDownShooterImage,
    category: GameTypes.GameCategory.ARCADE,
    difficulty: GameTypes.GameDifficulty.MEDIUM,
    estimatedPlayTime: 10,
    isMultiplayer: true,
    minAge: 6,
    minEntryFee: 0,
    isFreeToPlay: true,
    instructions: [
      "Use arrow keys or joystick to move your character.",
      "Aim and shoot at opponents using mouse or touch controls.",
      "Dodge incoming attacks and use cover effectively.",
      "Be the last player standing to win the match.",
    ],
  },
  "18-sky-hover": {
    id: "18-sky-hover",
    title: "Sky Hover",
    description:
      "Endless flying game where players control a hovering vehicle, navigating through the skies, avoiding obstacles, and collecting power-ups to achieve the highest score possible.",
    assets: skyHoverAssets,
    backgroundImage: skyHover,
    category: GameTypes.GameCategory.ARCADE,
    difficulty: GameTypes.GameDifficulty.EASY,
    estimatedPlayTime: 5,
    isMultiplayer: false,
    minAge: 5,
    minEntryFee: 0,
    isFreeToPlay: true,
    instructions: [
      "Use arrow keys or swipe controls to navigate the hovering vehicle.",
      "Avoid obstacles in the sky to keep flying.",
      "Collect power-ups along the way to boost your score.",
      "Aim for the highest score possible.",
    ],
  },
  "19-stack-breaker": {
    id: "19-stack-breaker",
    title: "Stack Breaker",
    description:
      "Bounce the emoji ball down the tower, breaking platforms as you fall. Smash through floors, avoid danger zones, and keep the streak going.",
    assets: stackBreakerAssets,
    backgroundImage: stackBreakerImage,
    category: GameTypes.GameCategory.ARCADE,
    difficulty: GameTypes.GameDifficulty.EASY,
    estimatedPlayTime: 5,
    isMultiplayer: false,
    minAge: 5,
    minEntryFee: 0,
    isFreeToPlay: true,
    instructions: [
      "Tap and hold to make the emoji ball drop.",
      "Break platforms by landing on them.",
      "Avoid special or dangerous platforms.",
      "Build combos by breaking multiple floors in a row.",
      "Falling without stopping increases your score.",
      "One wrong hit ends the run.",
    ],
  },
  "20-jump-sky": {
    id: "20-jump-sky",
    title: "Jump Sky",
    description:
      "Ascend through the sky by jumping on platforms, avoiding obstacles, and collecting power-ups to reach new heights and achieve the highest score possible.",
    assets: jumpSkyAssets,
    backgroundImage: jumpSkyImage,
    category: GameTypes.GameCategory.ARCADE,
    difficulty: GameTypes.GameDifficulty.EASY,
    estimatedPlayTime: 5,
    isMultiplayer: false,
    minAge: 5,
    minEntryFee: 0,
    isFreeToPlay: true,
    instructions: [
      "Use arrow keys or swipe controls to jump on platforms.",
      "Avoid obstacles while ascending.",
      "Collect power-ups to boost your jump height.",
      "Aim for the highest score possible by reaching new heights.",
    ],
  },
  "21-downhill-rush": {
    id: "21-downhill-rush",
    title: "Downhill Rush",
    description:
      "Experience the thrill of high-speed downhill racing in Downhill Rush, where players navigate treacherous slopes, avoid obstacles, and perform stunts to reach the finish line first.",
    assets: downhillRushAssets,
    backgroundImage: downhillRushImage,
    category: GameTypes.GameCategory.ARCADE,
    difficulty: GameTypes.GameDifficulty.MEDIUM,
    estimatedPlayTime: 10,
    isMultiplayer: false,
    minAge: 6,
    minEntryFee: 0,
    isFreeToPlay: true,
    instructions: [
      "Use arrow keys or swipe controls to navigate your racer downhill.",
      "Avoid obstacles and perform stunts to earn points.",
      "Reach the finish line as quickly as possible.",
      "Compete for the highest score on the leaderboard.",
    ],
  },
  "22-maze-rotator": {
    id: "22-maze-rotator",
    title: "Maze Rotator",
    description:
      "Navigate through complex mazes by rotating the environment to find the exit. Solve puzzles, avoid traps, and reach the goal in this challenging maze adventure.",
    assets: mazeRotatorAssets,
    backgroundImage: mazeRotatorImage,
    category: GameTypes.GameCategory.PUZZLE,
    difficulty: GameTypes.GameDifficulty.MEDIUM,
    estimatedPlayTime: 15,
    isMultiplayer: false,
    minAge: 7,
    minEntryFee: 0,
    isFreeToPlay: true,
    instructions: [
      "Rotate the base left or right.",
      "Emojis roll and fall based on gravity.",
      "Guide emojis toward the tube opening.",
      "Avoid tipping them out of the maze.",
      "The goal is to collect as many emojis as possible.",
    ],
  },
  "23-smashy-ball": {
    id: "23-smashy-ball",
    title: "Smashy Ball",
    description:
      "Roll the ball forward and collect balls of the same color. Avoid different colors to grow bigger and score higher.",
    assets: smashyBallAssets,
    backgroundImage: smashyBallImage,
    category: GameTypes.GameCategory.ARCADE,
    difficulty: GameTypes.GameDifficulty.EASY,
    estimatedPlayTime: 10,
    isMultiplayer: false,
    minAge: 5,
    minEntryFee: 0,
    isFreeToPlay: true,
    instructions: [
      "Swipe or drag to move the ball left and right.",
      "Collect balls that match your color.",
      "Avoid balls with different colors.",
      "Matching balls increases your size and score.",
      "Hitting the wrong color reduces progress or ends the run.",
    ],
  },
  "24-hoppy-rampage": {
    id: "24-hoppy-rampage",
    title: "Hoppy Rampage",
    description:
      "Jump between platforms to earn points. Choose wisely, some platforms add points, others subtract. Aim for the highest score possible.",
    assets: hoppyRampageAssets,
    backgroundImage: hoppyRampageImage,
    category: GameTypes.GameCategory.ARCADE,
    difficulty: GameTypes.GameDifficulty.EASY,
    estimatedPlayTime: 5,
    isMultiplayer: false,
    minAge: 5,
    minEntryFee: 0,
    isFreeToPlay: true,
    instructions: [
      "Tap to make the square avatar jump.",
      "Land on platforms with higher point values.",
      "Some platforms add points, others subtract.",
      "Platforms appear at different heights and distances.",
      "Timing and decision-making are key.",
      "The game ends if you miss a platform or fall.",
    ],
  },
};
