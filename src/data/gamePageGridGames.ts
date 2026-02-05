/**
 * @fileoverview Game Grid Configuration for Related Games Sidebar
 *
 * This file defines the 12 games displayed in the related games grid sidebar
 * with their exact positions. The position determines the size automatically
 * based on the grid pattern from the Figma design.
 *
 * Grid Layout (3 columns, positions 1-12):
 * ┌─────────────────────────────┐
 * │           1 (wide)          │  Row 1
 * ├────────┬────────────────────┤
 * │   2    │                    │  Row 2
 * ├────────┤     3 (large)      │
 * │   4    │                    │  Row 3
 * ├─────────────────────────────┤
 * │           5 (wide)          │  Row 4
 * ├────────────────────┬────────┤
 * │                    │   6    │  Row 5
 * │     7 (large)      ├────────┤
 * │                    │   8    │  Row 6
 * ├─────────────────────────────┤
 * │           9 (wide)          │  Row 7
 * ├────────────────────┬────────┤
 * │                    │   10   │  Row 8
 * │     11 (large)     ├────────┤
 * │                    │   12   │  Row 9
 * └────────────────────┴────────┘
 *
 * Size mapping based on position:
 * - wide:  positions 1, 5, 9 (spans 3 cols, 1 row)
 * - large: positions 3, 7, 11 (spans 2 cols, 2 rows)
 * - small: positions 2, 4, 6, 8, 10, 12 (spans 1 col, 1 row)
 */

export interface GridGame {
  /** Position in the grid (1-12), determines size and placement */
  position: number;
  /** Game slug - must match the slug in game data files */
  slug: string;
}

/**
 * Grid games configuration
 * Change the slug to swap which game appears in each position
 */
export const gridGames: GridGame[] = [
  // Row 1 - Wide
  { position: 1, slug: "underwateradventure" },

  // Row 2-3 - Small + Large
  { position: 2, slug: "ballslice" },
  { position: 3, slug: "embeddedwars" },
  { position: 4, slug: "cyberarena" },

  // Row 4 - Wide
  { position: 5, slug: "asteroids" },

  // Row 5-6 - Large (left) + Small (right)
  { position: 7, slug: "guerreromaya" }, // Large comes first for left placement
  { position: 6, slug: "topdownshooter" },
  { position: 8, slug: "endlessrunner" },

  // Row 7 - Wide
  { position: 9, slug: "smugglersrun" },

  // Row 8-9 - Large + Small
  { position: 10, slug: "embeddedsnake" },
  { position: 11, slug: "tankieracerattack" },
  { position: 12, slug: "ballslice" },
];

/**
 * Get the CSS size class based on grid position
 */
export const getGridSizeClass = (position: number): string => {
  // Wide positions: 1, 5, 9
  if (position === 1 || position === 5 || position === 9) {
    return "related-game--wide";
  }
  // Large positions: 3, 7, 11
  if (position === 3 || position === 7 || position === 11) {
    return "related-game--large";
  }
  // Small positions: 2, 4, 6, 8, 10, 12
  return "related-game--small";
};

export default gridGames;
