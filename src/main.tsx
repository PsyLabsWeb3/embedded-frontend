/**
 * @fileoverview Application Entry Point
 * 
 * This file serves as the main entry point for the React application,
 * responsible for mounting the root component and configuring the
 * development environment. It sets up React's Strict Mode for enhanced
 * development debugging and applies global styles.
 * 
 * Features:
 * - React 18 concurrent features support
 * - Strict mode for development quality assurance
 * - Global theme and style imports
 * - Application root mounting
 * 
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Import global styles - order matters for CSS cascade
import './styles/theme.css';  // Theme variables and design tokens
import './index.css';         // Global base styles and resets

// Import main application component
import App from './App';

/**
 * Application Bootstrap
 * 
 * Initializes the React application by mounting the root component
 * to the DOM. Uses React 18's createRoot API for enhanced performance
 * and concurrent features support.
 * 
 * StrictMode is enabled to provide additional development-time checks:
 * - Detection of unsafe lifecycles
 * - Warning about legacy string ref API usage
 * - Warning about deprecated findDOMNode usage
 * - Detection of unexpected side effects
 * - Detection of legacy context API
 */
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Failed to find the root element. Make sure there is an element with id="root" in your HTML file.'
  );
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
