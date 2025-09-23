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

import { GameTypes } from '../types';
import snakeGameImage from '../assets/snake_game.jpg';
import pingpongImage from '../assets/AsteroidsCover.png';
// import bubbleImage from '../assets/bubble.jpg';
import embeddedwarsImage from '../assets/embedded_wars.jpg';

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
    id: 'embedded-wars-game',
    title: 'Embedded Wars',
    slug: 'embeddedwars',
    image: embeddedwarsImage,
    glowClass: 'neon-green',
    description: '1v1 realtime Sci-Fi battle ',
    isFeatured: true,
    isNew: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  // {
  //   id: 'snake-game',
  //   title: 'Snake',
  //   slug: 'snake',
  //   image: snakeGameImage,
  //   glowClass: 'neon-blue',
  //   description: 'Classic snake game with number merging mechanics',
  //   isFeatured: true,
  //   isNew: false,
  //   createdAt: new Date('2024-01-01'),
  //   updatedAt: new Date('2024-01-15'),
  // },
  {
    id: 'ping-pong-game',
    title: 'Asteroids',
    slug: 'Asteroids',
    image: pingpongImage,
    glowClass: 'neon-white',
    description: 'Fast-paced table tennis action',
    isFeatured: true,
    isNew: false,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-16'),
  },
  // {
  //   id: 'bubble-merge-game',
  //   title: 'Bubble Merge',
  //   slug: 'bubblemerge',
  //   image: bubbleImage,
  //   glowClass: 'neon-purple',
  //   description: 'Merge colorful bubbles to score points',
  //   isFeatured: true,
  //   isNew: true,
  //   createdAt: new Date('2024-01-03'),
  //   updatedAt: new Date('2024-01-17'),
  // },
];

export default games;
