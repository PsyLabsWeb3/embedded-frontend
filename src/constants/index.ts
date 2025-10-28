/**
 * @fileoverview Application-wide constants and configuration values
 * 
 * This file centralizes all constant values used throughout the application,
 * promoting consistency and maintainability. Constants are organized by
 * functional areas and follow naming conventions for easy identification.
 * 
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

/**
 * Application routing constants
 * Centralized route definitions to prevent typos and ensure consistency
 */
export const ROUTES = {
  HOME: '/',
  GAMES: '/games',
  HISTORY: '/history',
  LEADERBOARD: '/leaderboard',
  REWARDS: '/rewards',
  TOURNAMENTS: '/tournaments',
  SNAKE_2048: '/snake2048',
  EMBEDDED_GAME: '/embedded-game',
  GAME_BASE: '/game',
} as const;

/**
 * Game route patterns for dynamic routing
 * These patterns are used for generating game-specific URLs
 */
export const GAME_ROUTES = {
  SNAKE: '/game/01-snake',
  ASTEROIDS: '/game/02-asteroids',
  EMBEDDED_WARS: '/game/03-embedded-wars',
  SMUGGLERS_RUN: '/game/12-smugglers-run',
} as const;

/**
 * UI/UX constants for consistent user experience
 */
export const UI_CONSTANTS = {
  MIN_TOUCH_TARGET_SIZE: 44, // Minimum touch target size in pixels for accessibility
  DEBOUNCE_DELAY: 300, // Default debounce delay for user interactions
  ANIMATION_DURATION: 200, // Standard animation duration in milliseconds
  TOAST_DURATION: 3000, // Toast notification display duration
  MAX_MOBILE_WIDTH: 768, // Breakpoint for mobile-first responsive design
} as const;

/**
 * Wallet adapter configuration
 * Solana network and wallet connection settings
 */
export const WALLET_CONFIG = {
  NETWORK: 'mainnet-beta',
  PROJECT_ID: '3de88ccc3439125e3b797794ef92929b',
  RELAY_URL: 'wss://relay.walletconnect.com',
} as const;

/**
 * Game-related constants
 */
export const GAME_CONSTANTS = {
  MAX_TITLE_LENGTH: 50,
  DEFAULT_GAME_TIMEOUT: 30000, // 30 seconds
  PLACEHOLDER_GAMES_COUNT: 11,
} as const;

/**
 * Error messages for consistent user communication
 */
export const ERROR_MESSAGES = {
  GAME_NOT_FOUND: 'Game not found or unavailable',
  NETWORK_ERROR: 'Network connection error. Please try again.',
  WALLET_CONNECTION_FAILED: 'Failed to connect wallet. Please try again.',
  INVALID_ROUTE: 'Invalid route or page not found',
  GAME_LOAD_FAILED: 'Failed to load game. Please refresh and try again.',
} as const;

/**
 * Success messages for positive user feedback
 */
export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: 'Wallet connected successfully',
  GAME_LOADED: 'Game loaded successfully',
  SCORE_SUBMITTED: 'Score submitted successfully',
} as const;

/**
 * Accessibility labels and ARIA attributes
 */
export const A11Y_LABELS = {
  LOGO: 'Embedded Gaming Platform Logo',
  SEARCH_BUTTON: 'Search games and content',
  WALLET_CONNECT: 'Connect cryptocurrency wallet',
  WALLET_DISCONNECT: 'Disconnect wallet',
  MOBILE_MENU: 'Open mobile navigation menu',
  GAME_CARD: 'Open game',
  BACK_TO_HOME: 'Return to homepage',
  PLAY_GAME: 'Start playing game',
} as const;

/**
 * Development and debugging constants
 */
export const DEV_CONFIG = {
  ENABLE_LOGGING: process.env.NODE_ENV === 'development',
  STRICT_MODE: true,
  PERFORMANCE_MONITORING: process.env.NODE_ENV === 'production',
} as const;

/**
 * Mobile Phantom wallet integration constants
 */
export const LOCAL_STORAGE_CONF = {
  LOCAL_KEYS: "phantom_dapp_keypair",
  LOCAL_SESSION: "phantom_session",
  LOCAL_WALLET_PUBKEY : "phantom_wallet_pubkey",
  LOCAL_PHANTOM_ENC: "phantom_encryption_public_key",
  LOCAL_REDIRECT: "phantom_post_connect_redirect",
  HANDLED_KEY: "phantom_callback_handled",
  HANDLED_TTL_MS: 5_000,
  PHANTOM_LAST_TRANSACTION: "phantom_last_tx",
  GAME_MODE: "game_mode",
  DEGEN_BET_AMOUNT: "degen_bet_amount",
}

/**
 * Type definitions for constant objects
 * These ensure type safety when using constants throughout the application
 */
export type RouteKey = keyof typeof ROUTES;
export type GameRouteKey = keyof typeof GAME_ROUTES;
export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;
export type SuccessMessageKey = keyof typeof SUCCESS_MESSAGES;
export type A11yLabelKey = keyof typeof A11Y_LABELS;
