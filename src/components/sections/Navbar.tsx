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
const Navbar: React.FC = () => (
  <nav className="navbar" role="navigation" aria-label="Main navigation">
    <div className="navbar__content mx-container">
      {/* Brand/Logo Section */}
      <Logo />
      
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

export default Navbar;
