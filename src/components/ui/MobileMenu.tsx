import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MobileMenu.css';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Bloquear scroll cuando el menú esté abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup: restaurar scroll al desmontar
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <button 
        className={`menu-toggle ${isOpen ? 'hidden' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
      
      <div className={`menu-overlay ${isOpen ? 'open' : ''}`}>
        <button 
          className="menu-close"
          onClick={closeMenu}
          aria-label="Close menu"
        >
          ×
        </button>
        <nav className="mobile-nav">
          <ul className="menu-items">
            <li><Link to="/" onClick={closeMenu} className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
            <li><Link to="/history" onClick={closeMenu} className={location.pathname === '/history' ? 'active' : ''}>History</Link></li>
            <li><Link to="/games" onClick={closeMenu} className={location.pathname === '/games' ? 'active' : ''}>Games</Link></li>
            <li><Link to="/leaderboard" onClick={closeMenu} className={location.pathname === '/leaderboard' ? 'active' : ''}>Leaderboard</Link></li>
            <li className="coming-soon-item">
              <div className="tournament-main">Rewards</div>
              <div className="coming-soon-text">Coming soon</div>
            </li>
            <li className="coming-soon-item">
              <div className="tournament-main">Tournaments</div>
              <div className="coming-soon-text">Coming soon</div>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default MobileMenu;
