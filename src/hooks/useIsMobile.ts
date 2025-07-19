/**
 * @fileoverview Mobile Detection Hook
 * 
 * Custom React hook for detecting mobile viewport sizes and providing
 * responsive behavior. Uses the standard mobile breakpoint and window
 * resize events for real-time updates.
 * 
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { UI_CONSTANTS } from '../constants';

/**
 * Custom hook to detect if the current viewport is mobile-sized
 * 
 * Uses the predefined mobile breakpoint from UI_CONSTANTS and listens
 * for viewport changes to provide real-time mobile/desktop detection.
 * 
 * @returns Boolean indicating if the current viewport is mobile-sized
 * 
 * @example
 * ```tsx
 * const MobileComponent = () => {
 *   const isMobile = useIsMobile();
 *   
 *   return (
 *     <div>
 *       {isMobile ? (
 *         <MobileLayout />
 *       ) : (
 *         <DesktopLayout />
 *       )}
 *     </div>
 *   );
 * };
 * ```
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    // Use the mobile breakpoint from constants for consistency
    const mql = window.matchMedia(`(max-width: ${UI_CONSTANTS.MAX_MOBILE_WIDTH - 1}px)`);
    
    /**
     * Handle viewport size changes
     * Updates the mobile state when the window is resized
     */
    const onChange = () => {
      setIsMobile(window.innerWidth < UI_CONSTANTS.MAX_MOBILE_WIDTH);
    };

    // Add event listener for changes
    mql.addEventListener('change', onChange);
    
    // Set initial state
    setIsMobile(window.innerWidth < UI_CONSTANTS.MAX_MOBILE_WIDTH);
    
    // Cleanup event listener on unmount
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // Return false during SSR/initial render to prevent hydration issues
  return !!isMobile;
}

export default useIsMobile;
