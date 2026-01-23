/**
 * @fileoverview Sidebar Component
 *
 * A reusable navigation sidebar component that provides quick access to
 * key platform features including leaderboard, history, and promotional pages.
 * This component is designed to be used across game pages.
 *
 * Features:
 * - Responsive design (hidden on mobile)
 * - Icon-based navigation
 * - Coming soon badges for features in development
 * - Accessibility support
 * - Professional styling with theme integration
 *
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants";
import "./Sidebar.css";
import leaderboardIcon from "../../assets/icons/leaderboardIcon.svg";
import historyIcon from "../../assets/icons/historyIcon.svg";
import advertiseIcon from "../../assets/icons/adIcon.svg";
import whitepaperIcon from "../../assets/icons/whitepaperIcon.svg";
import AdvertiseModal from "./AdvertiseModal";
import tournamentIcon from "../../assets/icons/tournamentIcon.svg";

/**
 * Icon components using imported SVG assets
 */
const LeaderboardIcon: React.FC = () => (
  <img src={leaderboardIcon} alt="" width="20" height="20" />
);

const HistoryIcon: React.FC = () => (
  <img src={historyIcon} alt="" width="20" height="20" />
);

const AdvertiseIcon: React.FC = () => (
  <img src={advertiseIcon} alt="" width="20" height="20" />
);

const WhitepaperIcon: React.FC = () => (
  <img src={whitepaperIcon} alt="" width="20" height="20" />
);

const TournamentIcon: React.FC = () => (
  <img src={tournamentIcon} alt="" width="20" height="20" />
);

/**
 * Sidebar Component
 *
 * Renders a vertical navigation sidebar with icon-based menu items.
 * The component automatically highlights the active route and displays
 * "Coming Soon" badges for features under development.
 *
 * @returns JSX element representing the sidebar navigation
 */
const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isAdvertiseModalOpen, setIsAdvertiseModalOpen] = useState(false);

  const handleAdvertiseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdvertiseModalOpen(true);
  };

  const handleCloseAdvertiseModal = () => {
    setIsAdvertiseModalOpen(false);
  };

  return (
    <>
      <aside
        className="sidebar"
        role="navigation"
        aria-label="Secondary navigation"
      >
        <nav className="sidebar__nav">
          {/* Leaderboard Link */}
          <Link
            to={ROUTES.LEADERBOARD}
            className={`sidebar__item ${
              location.pathname === ROUTES.LEADERBOARD
                ? "sidebar__item--active"
                : ""
            }`}
            aria-label="View leaderboard"
          >
            <LeaderboardIcon />
            <span className="sidebar__text">Leaderboard</span>
          </Link>

          {/* History Link */}
          <Link
            to={ROUTES.HISTORY}
            className={`sidebar__item ${
              location.pathname === ROUTES.HISTORY
                ? "sidebar__item--active"
                : ""
            }`}
            aria-label="View game history"
          >
            <HistoryIcon />
            <span className="sidebar__text">History</span>
          </Link>

          {/* Tournaments Link */}
          <Link
            to={ROUTES.TOURNAMENTS}
            className={`sidebar__item ${
              location.pathname === ROUTES.TOURNAMENTS
                ? "sidebar__item--active"
                : ""
            }`}
            aria-label="View tournaments"
          >
            <TournamentIcon />
            <span className="sidebar__text">Tournaments</span>
          </Link>

          {/* Advertise Link */}
          <button
            className="sidebar__item sidebar__item--button"
            aria-label="Advertise with us"
            onClick={handleAdvertiseClick}
            type="button"
          >
            <AdvertiseIcon />
            <span className="sidebar__text">Advertise</span>
          </button>

          {/* Whitepaper Link */}
          <Link
            to={ROUTES.WHITEPAPER}
            className={`sidebar__item ${
              location.pathname === ROUTES.WHITEPAPER
                ? "sidebar__item--active"
                : ""
            }`}
            aria-label="Read whitepaper"
          >
            <WhitepaperIcon />
            <span className="sidebar__text">Whitepaper</span>
          </Link>

          {/* Rewards - Coming Soon */}
          <div
            className="sidebar__item sidebar__item--disabled"
            aria-label="Rewards (Coming soon)"
          >
            <span className="sidebar__text sidebar__text--centered">
              Rewards Dashboard
            </span>
            <span className="sidebar__badge">COMING SOON</span>
          </div>
        </nav>
      </aside>

      {/* Advertise Modal */}
      <AdvertiseModal
        isOpen={isAdvertiseModalOpen}
        onClose={handleCloseAdvertiseModal}
      />
    </>
  );
};

export default Sidebar;
