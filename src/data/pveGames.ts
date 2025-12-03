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
import smugglersRunImage from '../assets/smugglers-run-poster.png';

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
    id: 'smugglers-run-game',
    title: 'Smugglers Run',
    slug: 'smugglersrun',
    image: smugglersRunImage,
    glowClass: 'neon-smugglers',
    description: '3D Race in Space',
    isFeatured: true,
    isNew: true,
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-15'),
    comingSoon: false
  },
];

export default games;
