/**
 * @fileoverview Game Display Data Registry
 *
 * This file contains the game data used for displaying game cards, lists,
 * and navigation throughout the application. This data is separate from
 * the game configurations to maintain a clean separation between display
 * logic and game implementation details.
 *
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

import { GameTypes } from "../types";
// import snakeGameImage from "../assets/snake_game.jpg";
import sliceImage from "../assets/gamesImages/Slice.png";
import underwaterAdventureImage from "../assets/gamesImages/UnderwaterAdventure.png";
import tankieRacerAttackImage from "../assets/gamesImages/TankieRacerAttack.png";
import topdownshooterImage from "../assets/gamesImages/TopDownShooter.png";
import donutMatchImage from "../assets/gamesImages/DonutMatch.png";
import zigzagEndlessRunnerImage from "../assets/gamesImages/ZigZagEndlessRunner.png";

/**
 * Game data interface for UI display
 * Extends the base GameData type with specific requirements for our UI
 */
export type Game = GameTypes.GameData;

/**
 * Game display data for cards, lists, and navigation
 *
 * This array contains the visual and routing information for all games
 * displayed in the application. Each entry corresponds to a game that
 * users can discover and play through the platform.
 *
 * Note: The slug field must match the game ID in gameConfigs.ts for
 * proper routing and configuration lookup.
 */

const completeFreeGames: Game[] = [
  // Underwater Adventure
  {
    id: "underwater-adventure-game",
    title: "Underwater Adventure",
    slug: "underwateradventure",
    image: underwaterAdventureImage,
    glowClass: "neon-blue",
    description:
      "Endless runner underwater world, dodging obstacles, collecting treasures, and exploring the depths of the ocean.",
    isFeatured: true,
    isNew: true,
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2024-11-15"),
    comingSoon: false,
  },
  {
    id: "top-down-shooter-game",
    title: "Top Down Shooter",
    slug: "topdownshooter",
    image: topdownshooterImage,
    glowClass: "neon-green",
    description:
      "Fast paced action game where players battle each other from a top-down view, using skill, strategy, in intense multiplayer arenas.",
    isFeatured: true,
    isNew: false,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
    comingSoon: false,
  },
  {
    id: "ballslice-game",
    title: "Slice",
    slug: "ballslice",
    image: sliceImage,
    glowClass: "neon-white",
    description:
      "Players swipe across the screen to slice balls, earning points for precise cuts while avoiding dangerous items and obstacles.",
    isFeatured: true,
    isNew: false,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-16"),
    comingSoon: false,
  },
  {
    id: "Tankie-Racer-Attack-game",
    title: "Tankie Racer Attack",
    slug: "tankieracerattack",
    image: tankieRacerAttackImage,
    glowClass: "neon-purple",
    description:
      "Endless tank racing game where you steer left or right on a zigzag track, race against enemy tanks, dodge obstacles, and battle your way through action-packed levels.",
    isFeatured: true,
    isNew: true,
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-17"),
  },
  {
    id: "donut-match-game",
    title: "Donut Match",
    slug: "donutmatch",
    image: donutMatchImage,
    glowClass: "neon-pink",
    description:
      "Match three or more donuts in a row to clear them from the board and score points. Use power-ups to clear larger sections and complete level objectives.",
    isFeatured: true,
    isNew: true,
    createdAt: new Date("2024-01-04"),
    updatedAt: new Date("2024-01-18"),
    comingSoon: false,
  },
  {
    id: "zigzag-endless-runner-game",
    title: "ZigZag Endless Runner",
    slug: "zigzagendlessrunner",
    image: zigzagEndlessRunnerImage,
    glowClass: "neon-orange",
    description:
      "Navigate a zigzag path in this endless runner, avoiding obstacles and collecting power-ups to achieve the highest score possible.",
    isFeatured: true,
    isNew: true,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-19"),
    comingSoon: false,
  },
];

export default completeFreeGames;
