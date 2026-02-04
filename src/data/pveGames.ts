/**
 * @fileoverview Game Display Data Registry
 *
 * This file contains the game data used for displaying game cards on The HOME page ONLY, lists,
 * and navigation throughout the application. This data is separate from
 * the game configurations to maintain a clean separation between display
 * logic and game implementation details.
 *
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

import { GameTypes } from "../types";
import smugglersRunImage from "../assets/gamesImages/SmugglersRun.png";
import guerreromayaImage from "../assets/gamesImages/GuerreroMaya.png";
import endlessRunnerImage from "../assets/gamesImages/EndlessRunner.png";

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

const games: Game[] = [
  {
    id: "guerrero-maya-game",
    title: "Guerrero Maya",
    slug: "guerreromaya",
    image: guerreromayaImage,
    glowClass: "neon-snake",
    description:
      "2D tower defense. Defend the Mezcal temple, plant agave to generate energy, and deploy units fast as enemy waves accelerate. Upgrade, adapt, and survive the chaos.",
    isFeatured: true,
    isNew: true,
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2024-11-15"),
    comingSoon: false,
  },
  {
    id: "endless-runner-game",
    title: "Endless Runner",
    slug: "endlessrunner",
    image: endlessRunnerImage,
    glowClass: "neon-snake",
    description:
      "Run nonstop through a dynamic 3D world, dodging obstacles, collecting rewards, and testing your reflexes as the speed increases.",
    isFeatured: true,
    isNew: true,
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2024-11-15"),
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

export default games;
