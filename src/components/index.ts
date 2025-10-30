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
export { default as Logo } from './atoms/common/Logo';
export { default as SearchIcon } from './atoms/navigation/SearchIcon';
export { default as ConnectWalletButton } from './atoms/navigation/ConnectWalletButton';
export { default as RewardBullet } from './atoms/RewardBullet';
export { default as RewardSeparator } from './atoms/RewardSeparator';
export { default as RewardTitle } from './atoms/RewardTitle';
export { default as PageTitle } from './atoms/PageTitle';
export { default as DescriptionText } from './atoms/DescriptionText';
export { default as PrimaryButton } from './atoms/PrimaryButton';

// Leaderboard Atomic Components
export { Button } from './atoms/common/Button';
export { PositionNumber } from './atoms/leaderboard/PositionNumber';
export { WalletIcon } from './atoms/leaderboard/WalletIcon';
export { WalletAddress } from './atoms/leaderboard/WalletAddress';
export { RewardValue } from './atoms/leaderboard/RewardValue';
export { IconText } from './atoms/leaderboard/IconText';
export { BannerIcon } from './atoms/common/BannerIcon';
export { BannerText } from './atoms/common/BannerText';

// Molecular Components
export { default as GameCard } from './molecules/GameCard';
export { default as RewardListItem } from './molecules/RewardListItem';
export { default as PageHeader } from './molecules/PageHeader';
export { default as ComingSoonCard } from './molecules/ComingSoonCard';

// Leaderboard Molecular Components
export { EmbeddedRewards } from './molecules/EmbeddedRewards';
export { CardActions } from './molecules/CardActions';
export { RewardsBanner } from './molecules/RewardsBanner';

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

// Leaderboard Organisms
export { LeaderboardCard } from './organisms/LeaderboardCard';
export { LeaderboardList } from './organisms/LeaderboardList';

// Game Components
export { default as GamePage } from './games/GamePage';
export { default as UnityGame } from './games/UnityGame';
export { default as PlaceholderGame } from './games/PlaceholderGame';

// Game Page Components
export {
  Snake,
  Asteroids,
  gamePageComponents,
  type GamePageKey
} from './games/gamePages';

// Template Components
export { default as GamePageTemplate } from './templates/GamePageTemplate';
export { default as MainLayout } from './templates/MainLayout';

// Leaderboard Templates
export { LeaderboardTemplate } from './templates/LeaderboardTemplate';

// Leaderboard Hooks and Types
export { useLeaderboard } from '../hooks/useLeaderboard';
export type { LeaderboardItem, PaginationState } from '../types/leaderboard';
