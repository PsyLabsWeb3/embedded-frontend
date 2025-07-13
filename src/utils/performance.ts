/**
 * @fileoverview Performance Optimization Utilities
 * 
 * Essential performance utilities for React component optimization.
 * This module provides the core memoization functions used throughout
 * the application for preventing unnecessary re-renders.
 * 
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

import { memo } from 'react';
import type { FC } from 'react';

/**
 * Creates a memoized version of a functional component with custom comparison
 * 
 * @param Component - The React functional component to memoize
 * @param areEqual - Optional custom comparison function
 * @returns Memoized component
 */
export function createMemoizedComponent<P extends Record<string, unknown>>(
  Component: FC<P>,
  areEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
): FC<P> {
  return memo(Component, areEqual);
}

/**
 * Comparison function specifically for game-related components
 * Optimized for GameCard components to prevent unnecessary re-renders
 */
export function gameComponentPropsEqual(
  prevProps: Readonly<{ slug?: string; title?: string; image?: string; className?: string }>,
  nextProps: Readonly<{ slug?: string; title?: string; image?: string; className?: string }>
): boolean {
  return (
    prevProps.slug === nextProps.slug &&
    prevProps.title === nextProps.title &&
    prevProps.image === nextProps.image &&
    prevProps.className === nextProps.className
  );
}

/**
 * Shallow comparison function for props
 * Useful for components with simple props
 */
export function shallowPropsEqual<T extends Record<string, unknown>>(
  prevProps: Readonly<T>,
  nextProps: Readonly<T>
): boolean {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);

  if (prevKeys.length !== nextKeys.length) {
    return false;
  }

  for (const key of prevKeys) {
    if (prevProps[key] !== nextProps[key]) {
      return false;
    }
  }

  return true;
}

/**
 * Comparison function for list components
 * Optimized for arrays and list-based props
 */
export function listPropsEqual<T extends Record<string, unknown>>(
  prevProps: Readonly<T>,
  nextProps: Readonly<T>
): boolean {
  // Handle array props specifically
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);

  if (prevKeys.length !== nextKeys.length) {
    return false;
  }

  for (const key of prevKeys) {
    const prevValue = prevProps[key];
    const nextValue = nextProps[key];

    // Special handling for arrays
    if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
      if (prevValue.length !== nextValue.length) {
        return false;
      }
      for (let i = 0; i < prevValue.length; i++) {
        if (prevValue[i] !== nextValue[i]) {
          return false;
        }
      }
    } else if (prevValue !== nextValue) {
      return false;
    }
  }

  return true;
}

/**
 * Performance optimization presets for common component types
 * Note: This is declared after all function definitions to avoid temporal dead zone issues
 */
export const OptimizationPresets = {
  /**
   * Optimization for static components that rarely change
   */
  static: {
    areEqual: () => true,
  },

  /**
   * Optimization for game card components
   */
  gameCard: {
    areEqual: gameComponentPropsEqual,
  },

  /**
   * Optimization for list components
   */
  list: {
    areEqual: listPropsEqual,
  },

  /**
   * Optimization for form components
   */
  form: {
    areEqual: shallowPropsEqual,
  },
} as const;
