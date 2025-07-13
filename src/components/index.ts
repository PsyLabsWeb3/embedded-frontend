/**
 * @fileoverview Main Component Library Exports
 * 
 * This file serves as the central export point for all reusable components,
 * utilities, types, and constants. It provides a clean API for importing
 * components throughout the application and establishes the component library
 * structure.
 * 
 * Organization follows atomic design principles:
 * - Atoms: Basic building blocks
 * - Molecules: Simple component combinations  
 * - Organisms: Complex component assemblies
 * - Templates: Page-level layouts
 * - Pages: Route-level components
 * 
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

// Atomic Components
export { default as Logo } from './atoms/Logo';
export { default as SearchIcon } from './atoms/SearchIcon';
export { default as ConnectWalletButton } from './atoms/ConnectWalletButton';
export { default as RewardBullet } from './atoms/RewardBullet';
export { default as RewardSeparator } from './atoms/RewardSeparator';
export { default as RewardTitle } from './atoms/RewardTitle';
export { default as PageTitle } from './atoms/PageTitle';
export { default as DescriptionText } from './atoms/DescriptionText';
export { default as PrimaryButton } from './atoms/PrimaryButton';

// Molecular Components
export { default as GameCard } from './molecules/GameCard';
export { default as RewardListItem } from './molecules/RewardListItem';
export { default as PageHeader } from './molecules/PageHeader';
export { default as ComingSoonCard } from './molecules/ComingSoonCard';

// Section Components (Organisms)
export { default as Navbar } from './sections/Navbar';
export { default as HeroSection } from './sections/HeroSection';
export { default as HeroStatCard } from './sections/HeroStatCard';
export { default as GameListSection } from './sections/GameListSection';
export { default as KeyFeatures } from './sections/KeyFeatures';
export { default as RewardsSection } from './sections/RewardsSection';
export { default as RewardSystemSection } from './sections/RewardSystemSection';
export { default as LeaderboardTable } from './organisms/LeaderboardTable';
export { default as GameGrid } from './organisms/GameGrid';

// Game Components
export { default as GamePage } from './games/GamePage';
export { default as UnityGame } from './games/UnityGame';
export { default as PlaceholderGame } from './games/PlaceholderGame';

// Game Page Components
export {
  Snake,
  PingPong,
  BubbleMerge,
  CandySweet,
  SortPuzzle,
  PipesFlood,
  HoverRacer,
  InfiniteRunner,
  CakeMania,
  Game10,
  Game11,
  gamePageComponents,
  type GamePageKey
} from './games/gamePages';

// Template Components
export { default as GamePageTemplate } from './templates/GamePageTemplate';
export { default as MainLayout } from './templates/MainLayout';
