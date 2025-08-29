/**
 * @fileoverview Enhanced TypeScript type definitions and interfaces
 * 
 * This file provides comprehensive type definitions for the entire application,
 * ensuring type safety, better IntelliSense support, and improved maintainability.
 * Types are organized by functional domains and include detailed JSDoc comments.
 * 
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

import type { ReactNode } from 'react';

/**
 * Base entity interface that all data models should extend
 * Provides common fields for consistent data structure
 */
export interface BaseEntity {
  /** Unique identifier for the entity */
  id: string;
  /** Timestamp when the entity was created */
  createdAt?: Date;
  /** Timestamp when the entity was last updated */
  updatedAt?: Date;
}

/**
 * Game-related type definitions
 */
export namespace GameTypes {
  /**
   * Unity WebGL game assets configuration
   * Contains all necessary file paths for loading Unity games
   */
  export interface UnityAssets {
    /** Path to the Unity loader JavaScript file */
    loaderUrl: string;
    /** Path to the Unity data file containing game assets */
    dataUrl: string;
    /** Path to the Unity framework JavaScript file */
    frameworkUrl: string;
    /** Path to the WebAssembly binary file */
    codeUrl: string;
  }

  /**
   * Comprehensive game configuration interface
   * Defines all properties needed to configure and display a game
   */
  export interface GameConfig extends BaseEntity {
    /** Display title of the game */
    title: string;
    /** Brief description of the game (optional) */
    description?: string;
    /** Unity assets configuration (for Unity-based games) */
    assets?: UnityAssets;
    /** Array of instruction strings for gameplay */
    instructions?: string[];
    /** Whether this is a placeholder game without actual implementation */
    placeholder?: boolean;
    /** Game category for filtering and organization */
    category?: GameCategory;
    /** Difficulty level of the game */
    difficulty?: GameDifficulty;
    /** Estimated play time in minutes */
    estimatedPlayTime?: number;
    /** Whether the game supports multiplayer */
    isMultiplayer?: boolean;
    /** Minimum age recommendation */
    minAge?: number;
    /** Whether the game should rotate on mobile devices */
    rotateOnMobile?: boolean;
  }

  /**
   * Game data structure for display in lists and cards
   * Simplified version of GameConfig for UI components
   */
  export interface GameData extends BaseEntity {
    /** Display title of the game */
    title: string;
    /** Path to the game's cover image */
    image: string;
    /** URL-friendly identifier for routing */
    slug: string;
    /** CSS class for visual effects (glow, animations) */
    glowClass: string;
    /** Brief description for tooltips or previews */
    description?: string;
    /** Whether the game is currently featured */
    isFeatured?: boolean;
    /** Whether the game is newly added */
    isNew?: boolean;
  }

  /**
   * Game categories for organization and filtering
   */
  export enum GameCategory {
    PUZZLE = 'puzzle',
    ACTION = 'action',
    STRATEGY = 'strategy',
    ARCADE = 'arcade',
    CASUAL = 'casual',
    MULTIPLAYER = 'multiplayer',
  }

  /**
   * Game difficulty levels
   */
  export enum GameDifficulty {
    EASY = 'easy',
    MEDIUM = 'medium',
    HARD = 'hard',
    EXPERT = 'expert',
  }

  /**
   * Game state management for tracking play sessions
   */
  export interface GameState {
    /** Current game being played */
    currentGame?: GameConfig;
    /** Whether a game is currently loading */
    isLoading: boolean;
    /** Any error that occurred during game operations */
    error?: string;
    /** Play session data */
    session?: GameSession;
  }

  /**
   * Game session tracking for analytics and progress
   */
  export interface GameSession {
    /** Session identifier */
    sessionId: string;
    /** Game being played */
    gameId: string;
    /** When the session started */
    startTime: Date;
    /** When the session ended (if completed) */
    endTime?: Date;
    /** Player's score (if applicable) */
    score?: number;
    /** Whether the session was completed successfully */
    completed: boolean;
  }
}

/**
 * Leaderboard-related type definitions
 */
export namespace LeaderboardTypes {
  /**
   * Leaderboard item representing a player's ranking data
   */
  export interface LeaderboardItem {
    /** Player's position in the leaderboard (1-based) */
    position: number;
    /** Player's wallet address */
    walletAddress: string;
    /** Player's accumulated points/score */
    points: number;
    /** Optional player name or display name */
    playerName?: string;
    /** Optional additional metadata */
    metadata?: Record<string, any>;
  }

  /**
   * Pagination state for leaderboard data
   */
  export interface PaginationState {
    /** Current page number (1-based) */
    currentPage: number;
    /** Total number of pages */
    totalPages: number;
    /** Number of items per page */
    itemsPerPage: number;
    /** Total number of items across all pages */
    totalItems: number;
  }

  /**
   * Leaderboard API response structure
   */
  export interface LeaderboardResponse {
    /** Array of leaderboard items */
    data: LeaderboardItem[];
    /** Pagination information */
    pagination?: PaginationState;
    /** Timestamp of the data */
    lastUpdated?: Date;
  }
}

/**
 * User interface and component-related types
 */
export namespace UITypes {
  /**
   * Standard component props that most components should accept
   */
  export interface BaseComponentProps {
    /** Optional CSS class name for styling */
    className?: string;
    /** Optional inline styles (use sparingly) */
    style?: React.CSSProperties;
    /** Optional test identifier for testing frameworks */
    testId?: string;
    /** Optional ARIA label for accessibility */
    ariaLabel?: string;
  }

  /**
   * Props for components that can contain other components
   */
  export interface ContainerProps extends BaseComponentProps {
    /** Child components to render */
    children: ReactNode;
  }

  /**
   * Props for interactive components (buttons, links, etc.)
   */
  export interface InteractiveProps extends BaseComponentProps {
    /** Whether the component is disabled */
    disabled?: boolean;
    /** Click handler function */
    onClick?: (event: React.MouseEvent) => void;
    /** Keyboard event handler */
    onKeyDown?: (event: React.KeyboardEvent) => void;
  }

  /**
   * Navigation-related props for routing components
   */
  export interface NavigationProps {
    /** Target route for navigation */
    to: string;
    /** Whether to replace the current history entry */
    replace?: boolean;
    /** State to pass to the target route */
    state?: any;
  }

  /**
   * Form component props for consistent form handling
   */
  export interface FormFieldProps extends BaseComponentProps {
    /** Field label text */
    label: string;
    /** Field name for form submission */
    name: string;
    /** Current field value */
    value: string;
    /** Change handler for field updates */
    onChange: (value: string) => void;
    /** Whether the field is required */
    required?: boolean;
    /** Validation error message */
    error?: string;
    /** Placeholder text */
    placeholder?: string;
  }

  /**
   * Modal and overlay component props
   */
  export interface ModalProps extends ContainerProps {
    /** Whether the modal is currently open */
    isOpen: boolean;
    /** Function to call when modal should close */
    onClose: () => void;
    /** Modal title for accessibility */
    title: string;
    /** Whether clicking outside should close the modal */
    closeOnOverlayClick?: boolean;
  }
}

/**
 * Wallet and blockchain-related types
 */
export namespace WalletTypes {
  /**
   * Wallet connection state
   */
  export interface WalletState {
    /** Whether a wallet is currently connected */
    isConnected: boolean;
    /** Public key of the connected wallet */
    publicKey?: string;
    /** Wallet adapter name */
    walletName?: string;
    /** Connection status */
    status: WalletStatus;
    /** Any connection error */
    error?: string;
  }

  /**
   * Possible wallet connection states
   */
  export enum WalletStatus {
    DISCONNECTED = 'disconnected',
    CONNECTING = 'connecting',
    CONNECTED = 'connected',
    ERROR = 'error',
  }

  /**
   * Transaction data structure
   */
  export interface Transaction {
    /** Transaction signature/hash */
    signature: string;
    /** Transaction amount (if applicable) */
    amount?: number;
    /** Transaction fee */
    fee: number;
    /** Transaction timestamp */
    timestamp: Date;
    /** Transaction status */
    status: TransactionStatus;
  }

  /**
   * Transaction status enumeration
   */
  export enum TransactionStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    FAILED = 'failed',
  }
}

/**
 * API and data fetching types
 */
export namespace APITypes {
  /**
   * Standard API response wrapper
   */
  export interface APIResponse<T = any> {
    /** Response data */
    data: T;
    /** Whether the request was successful */
    success: boolean;
    /** Human-readable message */
    message?: string;
    /** Error details if the request failed */
    error?: APIError;
    /** Response metadata */
    meta?: ResponseMetadata;
  }

  /**
   * API error structure for consistent error handling
   */
  export interface APIError {
    /** Error code for programmatic handling */
    code: string;
    /** Human-readable error message */
    message: string;
    /** Additional error details */
    details?: Record<string, any>;
    /** Stack trace (development only) */
    stack?: string;
  }

  /**
   * Response metadata for pagination and additional info
   */
  export interface ResponseMetadata {
    /** Current page number (for paginated responses) */
    page?: number;
    /** Number of items per page */
    limit?: number;
    /** Total number of items */
    total?: number;
    /** Response timestamp */
    timestamp: Date;
  }

  /**
   * Loading state for async operations
   */
  export interface LoadingState {
    /** Whether the operation is currently loading */
    isLoading: boolean;
    /** Any error that occurred */
    error?: string;
    /** Whether the operation has completed at least once */
    hasLoaded: boolean;
  }
}

/**
 * Utility types for common patterns
 */
export namespace UtilityTypes {
  /**
   * Make all properties of T optional except for K
   */
  export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

  /**
   * Extract the value type from an array type
   */
  export type ArrayElement<T> = T extends (infer U)[] ? U : never;

  /**
   * Create a type with only the specified keys from T
   */
  export type PickByValue<T, V> = Pick<T, {
    [K in keyof T]: T[K] extends V ? K : never;
  }[keyof T]>;

  /**
   * Recursive partial type for nested objects
   */
  export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
  };
}
