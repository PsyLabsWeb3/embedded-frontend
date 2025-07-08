import React from 'react';
import '../../styles/sections/SearchIcon.css';

// SearchIcon atom: ícono de lupa SVG
const SearchIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="7" stroke="var(--color-text-muted)" strokeWidth="2" />
    <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default SearchIcon;
