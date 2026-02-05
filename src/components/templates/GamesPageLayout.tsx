/**
 * @fileoverview GamesPageLayout Component
 *
 * A reusable layout wrapper for game listing pages that includes the sidebar
 * and properly positions the main content. This component standardizes the
 * layout structure across all game category pages.
 *
 * Features:
 * - Consistent sidebar integration
 * - Responsive layout with sidebar hiding on mobile
 * - Content area properly offset for sidebar
 * - Accessibility support
 *
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

import React from "react";
import Sidebar from "../organisms/Sidebar";
import "./GamesPageLayout.css";

interface GamesPageLayoutProps {
  /** Child components to render in the main content area */
  children: React.ReactNode;
  /** Optional additional CSS class name */
  className?: string;
}

/**
 * GamesPageLayout Component
 *
 * Provides a consistent layout structure for game listing pages with sidebar
 * navigation. The sidebar is automatically hidden on mobile devices and the
 * content area adjusts accordingly.
 *
 * Usage:
 * ```tsx
 * <GamesPageLayout>
 *   <YourPageContent />
 * </GamesPageLayout>
 * ```
 *
 * @param props - Component props
 * @returns JSX element representing the games page layout
 */
const GamesPageLayout: React.FC<GamesPageLayoutProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`games-page-layout ${className}`}>
      <Sidebar />
      <main className="games-page-layout__content">{children}</main>
    </div>
  );
};

export default GamesPageLayout;
