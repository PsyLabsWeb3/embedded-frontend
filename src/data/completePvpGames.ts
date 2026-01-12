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
import asteroidsImage from "../assets/gamesImages/Asteroids.png";
import cyberarenaImage from "../assets/gamesImages/CyberArena.png";
import smugglersRunImage from "../assets/gamesImages/SmugglersRun.png";
import embeddedwarsImage from "../assets/gamesImages/EmbeddedWars.png";

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

const pvpGames: Game[] = [
  {
    id: "embedded-wars-game",
    title: "Embedded Wars",
    slug: "embeddedwars",
    image: embeddedwarsImage,
    glowClass: "neon-green",
    description:
      "Battle armored space tanks in fast-paced arena combat where only the strongest survive, dominating the battlefield with strategy, firepower, and unshakable grit.",
    isFeatured: true,
    isNew: false,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
    comingSoon: false,
  },
  // Cyber Arena
  {
    id: "cyber-arena-game",
    title: "Cyber Arena",
    slug: "cyberarena",
    image: cyberarenaImage,
    glowClass: "neon-blue",
    description:
      "Fast paced arena shooter where two players battle each other in a dynamic colosseum. Jump between platforms and use powerful guns to outshoot your opponent.",
    isFeatured: true,
    isNew: true,
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2024-11-15"),
    comingSoon: false,
  },
  {
    id: "asteroids-game",
    title: "Asteroids",
    slug: "asteroids",
    image: asteroidsImage,
    glowClass: "neon-white",
    description:
      "Classic arcade space shooter where players pilot a spaceship, destroying drifting asteroids and enemy threats while avoiding collisions in the depths of space.",
    isFeatured: true,
    isNew: false,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-16"),
    comingSoon: false,
  },
  {
    id: "smugglers-run-game",
    title: "Smugglers Run",
    slug: "smugglersrun",
    image: smugglersRunImage,
    glowClass: "neon-smugglers",
    description:
      "Racing game where players speed through colorful tracks, using power ups to attack rivals or gain boosts, and racing to be the first to cross the finish line.",
    isFeatured: true,
    isNew: true,
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2024-11-15"),
    comingSoon: false,
  },
];

export default pvpGames;
