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
// import bubbleImage from "../assets/bubble.jpg";
import topdownshooterImage from "../assets/gamesImages/TopDownShooter.png";

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

const freeGames: Game[] = [
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
    id: "slice-game",
    title: "Slice",
    slug: "slice",
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
  // {
  //   id: "bubble-merge-game",
  //   title: "Bubble Merge",
  //   slug: "bubblemerge",
  //   image: bubbleImage,
  //   glowClass: "neon-purple",
  //   description: "Merge colorful bubbles to score points",
  //   isFeatured: true,
  //   isNew: true,
  //   createdAt: new Date("2024-01-03"),
  //   updatedAt: new Date("2024-01-17"),
  // },
];

export default freeGames;
