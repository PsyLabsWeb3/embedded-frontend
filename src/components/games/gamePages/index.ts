/**
 * @fileoverview Game Pages Module Exports
 * 
 * This module serves as the central export point for all game page components.
 * It provides both named exports for individual components and a configuration
 * object for dynamic component loading and routing.
 * 
 * The module follows a consistent naming convention and provides TypeScript
 * support for type-safe component access and routing.
 * 
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

// Individual Game Page Exports
// These exports allow for direct imports of specific game components
export { default as Snake } from './01_Snake';
export { default as Asteroids } from './02_Asteroids';
export { default as EmbeddedWars } from './03_EmbeddedWars';
export { default as CandySweet } from './04_CandySweet';
export { default as SortPuzzle } from './05_SortPuzzle';
export { default as PipesFlood } from './06_PipesFlood';
export { default as HoverRacer } from './07_HoverRacer';
export { default as InfiniteRunner } from './08_InfiniteRunner';
export { default as CakeMania } from './09_CakeMania';
export { default as Game10 } from './10_Game10';
export { default as Game11 } from './11_Game11';

// Import components for internal mapping
import Snake from './01_Snake';
import Asteroids from './02_Asteroids';
import EmbeddedWars from './03_EmbeddedWars';
import CandySweet from './04_CandySweet';
import SortPuzzle from './05_SortPuzzle';
import PipesFlood from './06_PipesFlood';
import HoverRacer from './07_HoverRacer';
import InfiniteRunner from './08_InfiniteRunner';
import CakeMania from './09_CakeMania';
import Game10 from './10_Game10';
import Game11 from './11_Game11';

/**
 * Game component mapping for dynamic access
 * 
 * This object provides a way to access game components programmatically
 * using their route identifiers. It's particularly useful for:
 * - Dynamic routing systems
 * - Component lazy loading
 * - Programmatic component access
 * - Type-safe component resolution
 * 
 * The keys must match the route patterns defined in the application's
 * routing configuration for proper navigation and component loading.
 */
export const gamePageComponents = {
  '01-snake': Snake,
  '02-asteroids': Asteroids,
  '03-embedded-wars': EmbeddedWars,
  '04-candy-sweet': CandySweet,
  '05-sort-puzzle': SortPuzzle,
  '06-pipes-flood': PipesFlood,
  '07-hover-racer': HoverRacer,
  '08-infinite-runner': InfiniteRunner,
  '09-cake-mania': CakeMania,
  '10-game-10': Game10,
  '11-game-11': Game11,
} as const;

/**
 * Type definition for game page component keys
 * 
 * This type ensures type safety when accessing game components
 * programmatically and provides IntelliSense support in development.
 * 
 * @example
 * ```typescript
 * const gameKey: GamePageKey = '01-snake';
 * const GameComponent = gamePageComponents[gameKey];
 * ```
 */
export type GamePageKey = keyof typeof gamePageComponents;
