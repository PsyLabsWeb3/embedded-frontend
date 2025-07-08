import React from 'react';
import '../../styles/sections/Logo.css';

// Responsive Logo component using CSS classes
const Logo: React.FC = () => (
  <div className="logo-container">
    <img
      src="/logo.svg"
      alt="Embedded Logo"
      className="logo-image"
    />

  </div>
);


export default Logo;
