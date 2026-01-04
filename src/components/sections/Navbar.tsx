/**
 * @fileoverview Navbar Component
 * 
 * The main navigation bar component that provides site-wide navigation,
 * search functionality, and wallet connection interface. This component
 * is responsive and includes mobile-specific interactions.
 * 
 * Features:
 * - Responsive design with mobile menu
 * - Wallet connection integration
 * - Search functionality
 * - Accessibility support
 * - Professional styling with theme integration
 * 
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../atoms/common/Logo';
import SearchIcon from '../atoms/navigation/SearchIcon';
import ConnectWalletButton from '../atoms/navigation/ConnectWalletButton';
import MobileMenu from '../ui/MobileMenu';
import { A11Y_LABELS } from '../../constants';

// Import theme and component styles
import '../../styles/theme.css';
import '../../styles/utilities.css';
import '../../styles/sections/Navbar.css';
import '../../styles/sections/Logo.css';
import '../../styles/sections/ConnectWalletButton.css';
import '../../styles/sections/SearchIcon.css';

/**
 * Navbar Component
 * 
 * Renders the main navigation bar with logo, search functionality,
 * mobile menu, and wallet connection button. The component follows
 * atomic design principles and uses semantic HTML for accessibility.
 * 
 * @returns JSX element representing the navigation bar
 */
const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar__content mx-container">
        {/* Brand/Logo Section */}
        <Logo />

        {/* Center Links Section */}
        <div className="navbar__links" aria-label="Primary links">
          <Link to="/" className={`navbar__link ${location.pathname === '/' ? 'is-active' : ''}`}>Home</Link>
          <Link to="/games-free" className={`navbar__link ${location.pathname === '/games-free' ? 'is-active' : 'is-muted'}`}>Free to Play</Link>
          <Link to="/games-pvp" className={`navbar__link ${location.pathname === '/games-pvp' ? 'is-active' : 'is-muted'}`}>PVP Games</Link>
          <Link to="/games-pve" className={`navbar__link ${location.pathname === '/games-pve' ? 'is-active' : 'is-muted'}`}>PVE Games</Link>
        </div>

        {/* Actions Section - Search, Mobile Menu, Wallet */}
        <div className="navbar__actions">
          {/* Search Button */}
          <button 
            className="navbar__search-btn" 
            aria-label={A11Y_LABELS.SEARCH_BUTTON}
            type="button"
          >
            <SearchIcon />
          </button>
          
          {/* Mobile Menu Toggle */}
          <MobileMenu />
          
          {/* Wallet Connection */}
          <ConnectWalletButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
