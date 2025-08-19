/**
 * @fileoverview UnityGame Component
 * 
 * A reusable component for rendering Unity WebGL games within the React
 * application. This component handles Unity context initialization, asset
 * loading, and provides a consistent interface for all Unity-based games.
 * 
 * Features:
 * - Unity WebGL context management
 * - Asset loading and initialization
 * - Responsive design support
 * - Error handling for Unity loading
 * - Performance optimization
 * 
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

import React, { useMemo } from 'react';
import { Unity, useUnityContext } from "react-unity-webgl";
import { GameTypes } from '../../types';
import styles from './Snake2048.module.css';

/**
 * Props interface for the UnityGame component
 */
interface UnityGameProps {
  /** Unity WebGL game assets configuration */
  gameAssets: GameTypes.UnityAssets;
  /** Optional CSS class name for custom styling */
  className?: string;
  /** Optional callback for Unity loading events */
  onLoaded?: () => void;
  /** Optional callback for Unity error events */
  onError?: (error: string) => void;
  /** Optional publicKey to send to Unity */
  publicKey?: string | null;
  /** Optional transaction id (signature) to send to Unity after successful payment */
  transactionId?: string | null;
}

/**
 * UnityGame Component (Internal Implementation)
 * 
 * Renders a Unity WebGL game using the react-unity-webgl library.
 * The component initializes the Unity context with the provided assets
 * and handles the rendering lifecycle.
 * 
 * The component uses useMemo to prevent unnecessary re-creation of the
 * Unity context when props haven't changed, improving performance.
 * 
 * @param props - Component props containing game assets and configuration
 * @returns JSX element representing the Unity game canvas
 */
const UnityGameComponent: React.FC<UnityGameProps> = ({ 
  gameAssets, 
  className,
  onLoaded,
  onError: _onError, // Renamed to indicate it's intentionally unused for now
  publicKey,
  transactionId
}) => {
  /**
   * Initialize Unity context with memoization for performance
   * Only recreates the context when gameAssets change
   */
  const unityContextConfig = useMemo(() => ({
    loaderUrl: gameAssets.loaderUrl,
    dataUrl: gameAssets.dataUrl,
    frameworkUrl: gameAssets.frameworkUrl,
    codeUrl: gameAssets.codeUrl,
  }), [gameAssets]);

  const { unityProvider, isLoaded, loadingProgression, sendMessage } = useUnityContext(unityContextConfig);

  /**
   * Handle Unity loading completion
   */
  React.useEffect(() => {
    if (isLoaded && onLoaded) {
      onLoaded();
    }
  }, [isLoaded, onLoaded]);

  /**
   * Send publicKey to Unity when available
   */
  React.useEffect(() => {
    if (isLoaded && publicKey) {
      sendMessage("WalletManager", "SetWalletAddress", publicKey.toString());
      // Puedes agregar un log si lo deseas
      // console.log("Enviado a Unity:", publicKey.toString());
    }
  }, [isLoaded, publicKey, sendMessage]);

  /**
   * Send transactionId to Unity when available
   */
  React.useEffect(() => {
    if (isLoaded && typeof transactionId === 'string' && transactionId.length > 0) {
      sendMessage("WalletManager", "SetTransactionId", transactionId);
      // console.log("Enviado tx a Unity:", transactionId);
    }
  }, [isLoaded, transactionId, sendMessage]);

  /**
   * Determine the appropriate CSS class for styling
   * Falls back to default styles if no custom class provided
   */
  const containerClass = className || styles.container;

  return (
    <div className="unity-game-wrapper">
      {/* Loading indicator while Unity initializes */}
      {!isLoaded && (
        <div className="unity-loading-indicator" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--font-size-sm)',
        }}>
          <div>Loading Game...</div>
          <div style={{ marginTop: '0.5rem', fontSize: 'var(--font-size-xs)' }}>
            {Math.round(loadingProgression * 100)}%
          </div>
        </div>
      )}
      
      {/* Unity game canvas */}
      <Unity 
        className={containerClass} 
        unityProvider={unityProvider}
        style={{
          opacity: isLoaded ? 1 : 0.5,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
    </div>
  );
};

/**
 * Optimized UnityGame Component
 * 
 * A performance-optimized version that prevents unnecessary re-renders
 * when the gameAssets object reference hasn't changed. This is important
 * for Unity games as re-initializing the context can be expensive.
 */
const UnityGame = React.memo(UnityGameComponent, (prevProps, nextProps) => {
  return (
    prevProps.gameAssets === nextProps.gameAssets &&
    prevProps.className === nextProps.className
  );
});

export default UnityGame;
