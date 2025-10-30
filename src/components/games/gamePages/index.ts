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
export { default as EmbeddedSpaceRace } from './12_EmbeddedSpaceRace';

// Import components for internal mapping
import Snake from './01_Snake';
import Asteroids from './02_Asteroids';
import EmbeddedWars from './03_EmbeddedWars';
import EmbeddedSpaceRace from './12_EmbeddedSpaceRace';

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
  '12-embedded-space-race': EmbeddedSpaceRace,
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
