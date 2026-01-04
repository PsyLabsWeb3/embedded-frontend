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
        className={`menu-toggle ${isOpen ? 'hidden' : ''} ${isOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className={`hamburger ${isOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
      
      <div className={`menu-overlay ${isOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
        <div className="menu-panel" role="document">
          <div className="menu-header">
            <h2 className="menu-title">Menu</h2>
            <button 
              className="menu-close"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              x
            </button>
          </div>
          <nav className="mobile-nav">
            <ul className="menu-items">
              <li><Link to="/" onClick={closeMenu} className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
              <li><Link to="/history" onClick={closeMenu} className={location.pathname === '/history' ? 'active' : ''}>History</Link></li>
              <li><Link to="/games-pve" onClick={closeMenu} className={location.pathname === '/games-pve' ? 'active' : ''}>PvE</Link></li>
              <li><Link to="/games-pvp" onClick={closeMenu} className={location.pathname === '/games-pvp' ? 'active' : ''}>PvP</Link></li>
              <li><Link to="/leaderboard" onClick={closeMenu} className={location.pathname === '/leaderboard' ? 'active' : ''}>Leaderboard</Link></li>
              <li className="coming-soon-row">
                <div className="coming-soon-label">Tournaments</div>
                <div className="coming-soon-pill">COMING SOON</div>
              </li>
              <li className="coming-soon-row">
                <div className="coming-soon-label">Rewards</div>
                <div className="coming-soon-pill">COMING SOON</div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
