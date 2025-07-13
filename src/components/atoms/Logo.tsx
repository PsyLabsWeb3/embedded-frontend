/**
 * @fileoverview Logo Component
 * 
 * A responsive logo component that serves as both branding and navigation
 * to the homepage. This atomic component follows accessibility best practices
 * and integrates seamlessly with the application's navigation system.
 * 
 * Features:
 * - Responsive design with CSS-based sizing
 * - Navigation integration via React Router
 * - Accessibility support with proper alt text
 * - Professional styling with theme integration
 * 
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES, A11Y_LABELS } from '../../constants';
import '../../styles/sections/Logo.css';

/**
 * Logo Component
 * 
 * Renders the application logo as a navigable link to the homepage.
 * The component uses semantic HTML and proper accessibility attributes
 * to ensure compatibility with screen readers and other assistive technologies.
 * 
 * The logo is implemented as an image element wrapped in a Link component
 * for proper navigation behavior and SEO benefits.
 * 
 * @returns JSX element representing the clickable logo
 */
const Logo: React.FC = () => (
  <Link 
    to={ROUTES.HOME} 
    className="logo-container"
    aria-label={A11Y_LABELS.LOGO}
  >
    <img
      src="/logo.svg"
      alt="Embedded Logo"
      className="logo-image"
      loading="eager" // Logo should load immediately for branding
    />
  </Link>
);


export default Logo;
