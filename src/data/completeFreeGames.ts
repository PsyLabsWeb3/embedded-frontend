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
import roundBallImage from "../assets/gamesImages/RoundBall.png";
import crazyBallImage from "../assets/gamesImages/CrazyBall.png";
import swipeGameImage from "../assets/gamesImages/SwipeGame.png";
import colorCatchImage from "../assets/gamesImages/ColorCatch.png";
import skyHoverImage from "../assets/gamesImages/SkyHover.png";
import stackBreakerImage from "../assets/gamesImages/StackBreaker.png";
import jumpSkyImage from "../assets/gamesImages/JumpSky.png";
import downhillRushImage from "../assets/gamesImages/DownhillRush.png";
import mazeRotatorImage from "../assets/gamesImages/MazeRotator.png";
import smashyBallImage from "../assets/gamesImages/SmashyBall.png";
import hoppyRampageImage from "../assets/gamesImages/HoppyRampage.png";
import klondikeSolitaireImage from "../assets/gamesImages/KlondikeSolitaire.png";

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
  {
    id: "round-ball-game",
    title: "Round Ball",
    slug: "roundball",
    image: roundBallImage,
    glowClass: "neon-yellow",
    description:
      "3D rolling ball game where players navigate a spherical character through dynamic environments, overcoming obstacles and collecting items to reach the finish line.",
    isFeatured: true,
    isNew: true,
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date("2024-06-15"),
    comingSoon: false,
  },
  {
    id: "crazy-ball-game",
    title: "Crazy Ball",
    slug: "crazyball",
    image: crazyBallImage,
    glowClass: "neon-red",
    description:
      "Control a rolling ball through dynamic levels, avoiding obstacles, collecting rewards, and testing their reflexes as the speed and challenge increase.",
    isFeatured: true,
    isNew: true,
    createdAt: new Date("2024-06-10"),
    updatedAt: new Date("2024-06-20"),
    comingSoon: false,
  },
  {
    id: "swipe-game",
    title: "Swipe Game",
    slug: "swipegame",
    image: swipeGameImage,
    glowClass: "neon-cyan",
    description:
      "Move a character around the screen to collect points while carefully avoiding dangerous black dots, testing quick reflexes and precise movement.",
    isFeatured: true,
    isNew: true,
    createdAt: new Date("2024-06-15"),
    updatedAt: new Date("2024-06-25"),
    comingSoon: false,
  },
  {
    id: "color-catch-game",
    title: "Color Catch",
    slug: "colorcatch",
    image: colorCatchImage,
    glowClass: "neon-magenta",
    description:
      "Players rotate an object left or right to collect balls of the matching color while avoiding balls of different colors, testing timing, focus, and quick reactions.",
    isFeatured: true,
    isNew: true,
    createdAt: new Date("2024-06-20"),
    updatedAt: new Date("2024-06-30"),
    comingSoon: false,
  },
  {
    id: "sky-hover-game",
    title: "Sky Hover",
    slug: "skyhover",
    image: skyHoverImage,
    glowClass: "neon-sky",
    description:
      "Soar through the skies in this endless hover game, navigating through clouds and obstacles while collecting power-ups to enhance your flight experience.",
    isFeatured: true,
    isNew: true,
    createdAt: new Date("2024-07-01"),
    updatedAt: new Date("2024-07-15"),
    comingSoon: false,
  },
  {
    id: "stack-breaker-game",
    title: "Stack Breaker",
    slug: "stackbreaker",
    image: stackBreakerImage,
    glowClass: "neon-lime",
    description:
      "Test your precision and timing in Stack Breaker, where players aim to break through stacked blocks by dropping a ball at the right moment to score points and clear levels.",
    isFeatured: true,
    isNew: true,
    createdAt: new Date("2024-07-10"),
    updatedAt: new Date("2024-07-20"),
    comingSoon: false,
  },
  {
    id: "jump-sky-game ",
    title: "Jump Sky",
    slug: "jumpsky",
    image: jumpSkyImage,
    glowClass: "neon-blue",
    description:
      "Leap through the sky in this thrilling jump game, avoiding obstacles Jump between rising platforms as a one-eyed cube. Collect coins, dodge spikes and lava, and survive as the levels move upward.",
    isFeatured: true,
    isNew: true,
    createdAt: new Date("2024-07-15"),
    updatedAt: new Date("2024-07-25"),
    comingSoon: false,
  },
  {
    id: "downhill-rush-game",
    title: "Downhill Rush",
    slug: "downhillrush",
    image: downhillRushImage,
    glowClass: "neon-red",
    description:
      "Experience the thrill of high-speed downhill racing in Downhill Rush, where players navigate treacherous slopes, avoid obstacles, and perform stunts to reach the finish line first.",
    isFeatured: true,
    isNew: true,
    createdAt: new Date("2024-07-20"),
    updatedAt: new Date("2024-07-30"),
    comingSoon: false,
  },
  {
    id: "maze-rotator-game",
    title: "Maze Rotator",
    slug: "mazerotator",
    image: mazeRotatorImage,
    glowClass: "neon-green",
    description:
      "Rotate the maze to guide emoji balls into the tube. Use gravity and timing to fit as many emojis inside without letting them fall out.",
    isFeatured: true,
    isNew: true,
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2024-08-15"),
    comingSoon: false,
  },
  {
    id: "smashy-ball-game",
    title: "Smashy Ball",
    slug: "smashyball",
    image: smashyBallImage,
    glowClass: "neon-yellow",
    description:
      "Roll the ball forward and collect balls of the same color. Avoid different colors to grow bigger and score higher. Aim carefully and time your smashes to clear levels and earn points.",
    isFeatured: true,
    isNew: true,
    createdAt: new Date("2024-08-10"),
    updatedAt: new Date("2024-08-20"),
    comingSoon: false,
  },
  {
    id: "hoppy-rampage-game",
    title: "Hoppy Rampage",
    slug: "hoppyrampage",
    image: hoppyRampageImage,
    glowClass: "neon-pink",
    description:
      "Jump between platforms to earn points. Choose wisely, some platforms add points, others subtract. avoiding obstacles and collecting carrots to achieve the highest score possible.",
    isFeatured: true,
    isNew: true,
    createdAt: new Date("2024-08-15"),
    updatedAt: new Date("2024-08-25"),
    comingSoon: false,
  },
  {
    id: "klondike-solitaire-game",
    title: "Klondike Solitaire",
    slug: "klondikesolitaire",
    image: klondikeSolitaireImage,
    glowClass: "neon-cyan",
    description:
      "Classic Klondike Solitaire game where players arrange cards in descending order and alternating colors to build foundation piles from Ace to King. Use strategy and patience to clear the board and win.",
    isFeatured: true,
    isNew: true,
    createdAt: new Date("2024-08-20"),
    updatedAt: new Date("2024-08-30"),
    comingSoon: false,
  },
];

export default completeFreeGames;
