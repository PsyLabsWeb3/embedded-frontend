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

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants";
import "./Sidebar.css";

/**
 * Icon components as SVGs for optimal performance
 */
const LeaderboardIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.66667 15.8333V10H13.3333V15.8333M4.16667 7.5V15.8333H6.66667V7.5H4.16667ZM13.3333 5.83333V15.8333H15.8333V5.83333H13.3333ZM2.5 17.5V9.16667H8.33333V8.33333H11.6667V4.16667H17.5V17.5H2.5Z"
      fill="currentColor"
    />
  </svg>
);

const HistoryIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 4.16667C11.3261 4.16667 12.5979 4.69345 13.5355 5.63114C14.4732 6.56883 15 7.84058 15 9.16667C15 10.4928 14.4732 11.7645 13.5355 12.7022C12.5979 13.6399 11.3261 14.1667 10 14.1667C8.67392 14.1667 7.40215 13.6399 6.46447 12.7022C5.52678 11.7645 5 10.4928 5 9.16667H3.33333C3.33333 10.9348 4.03571 12.6305 5.28595 13.8807C6.53619 15.131 8.23189 15.8333 10 15.8333C11.7681 15.8333 13.4638 15.131 14.714 13.8807C15.9643 12.6305 16.6667 10.9348 16.6667 9.16667C16.6667 7.39856 15.9643 5.70286 14.714 4.45262C13.4638 3.20238 11.7681 2.5 10 2.5V4.16667ZM9.16667 9.16667V5.83333H10.8333V8.33333H12.9167L9.16667 12.0833V9.16667Z"
      fill="currentColor"
    />
  </svg>
);

const AdvertiseIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 4.16667H5C4.08333 4.16667 3.33333 4.91667 3.33333 5.83333V14.1667C3.33333 15.0833 4.08333 15.8333 5 15.8333H15C15.9167 15.8333 16.6667 15.0833 16.6667 14.1667V5.83333C16.6667 4.91667 15.9167 4.16667 15 4.16667ZM15 14.1667H5V5.83333H15V14.1667ZM11.6667 12.5L8.33333 9.16667L6.66667 11.25L5 9.16667V13.3333H15V10L13.3333 8.33333L11.6667 12.5Z"
      fill="currentColor"
    />
  </svg>
);

const WhitepaperIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.6667 2.5H5C4.55797 2.5 4.13405 2.67559 3.82149 2.98816C3.50893 3.30072 3.33333 3.72464 3.33333 4.16667V15.8333C3.33333 16.2754 3.50893 16.6993 3.82149 17.0118C4.13405 17.3244 4.55797 17.5 5 17.5H15C15.442 17.5 15.866 17.3244 16.1785 17.0118C16.4911 16.6993 16.6667 16.2754 16.6667 15.8333V7.5L11.6667 2.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.6667 2.5V7.5H16.6667"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
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

  return (
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
            location.pathname === ROUTES.HISTORY ? "sidebar__item--active" : ""
          }`}
          aria-label="View game history"
        >
          <HistoryIcon />
          <span className="sidebar__text">History</span>
        </Link>

        {/* Advertise Link */}
        <Link
          to="#"
          className="sidebar__item"
          aria-label="Advertise with us"
          onClick={(e) => {
            e.preventDefault();
            // TODO: Add advertise functionality or external link
          }}
        >
          <AdvertiseIcon />
          <span className="sidebar__text">Advertise</span>
        </Link>

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

        {/* Tournaments - Coming Soon */}
        <div
          className="sidebar__item sidebar__item--disabled"
          aria-label="Tournaments (Coming soon)"
        >
          <span className="sidebar__text sidebar__text--centered">
            Tournaments
          </span>
          <span className="sidebar__badge">COMING SOON</span>
        </div>

        {/* Rewards - Coming Soon */}
        <div
          className="sidebar__item sidebar__item--disabled"
          aria-label="Rewards (Coming soon)"
        >
          <span className="sidebar__text sidebar__text--centered">Rewards</span>
          <span className="sidebar__badge">COMING SOON</span>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
