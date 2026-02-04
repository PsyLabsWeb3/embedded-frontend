import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants";
import "./MobileMenu.css";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Bloquear scroll cuando el menú esté abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup: restaurar scroll al desmontar
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <button
        className={`menu-toggle ${isOpen ? "hidden" : ""} ${isOpen ? "open" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className={`hamburger ${isOpen ? "open" : ""}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      <div
        className={`menu-overlay ${isOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
      >
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
              <li>
                <Link
                  to={ROUTES.HOME}
                  onClick={closeMenu}
                  className={location.pathname === ROUTES.HOME ? "active" : ""}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.GAMES_FREE}
                  onClick={closeMenu}
                  className={
                    location.pathname === ROUTES.GAMES_FREE ? "active" : ""
                  }
                >
                  Free To Play
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.GAMES_PVE}
                  onClick={closeMenu}
                  className={
                    location.pathname === ROUTES.GAMES_PVE ? "active" : ""
                  }
                >
                  PvE
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.GAMES_PVP}
                  onClick={closeMenu}
                  className={
                    location.pathname === ROUTES.GAMES_PVP ? "active" : ""
                  }
                >
                  PvP
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.LEADERBOARD}
                  onClick={closeMenu}
                  className={
                    location.pathname === ROUTES.LEADERBOARD ? "active" : ""
                  }
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.HISTORY}
                  onClick={closeMenu}
                  className={
                    location.pathname === ROUTES.HISTORY ? "active" : ""
                  }
                >
                  History
                </Link>
              </li>

              <li>
                <Link
                  to={ROUTES.TOURNAMENTS}
                  onClick={closeMenu}
                  className={
                    location.pathname === ROUTES.TOURNAMENTS ? "active" : ""
                  }
                >
                  Tournaments
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.FAQS}
                  onClick={closeMenu}
                  className={location.pathname === ROUTES.FAQS ? "active" : ""}
                >
                  FAQs
                </Link>
              </li>

              <li className="coming-soon-row">
                <div className="coming-soon-label">Rewards</div>
                <div className="coming-soon-pill">COMING SOON</div>
              </li>
              <li>
                <Link
                  to={ROUTES.WHITEPAPER}
                  onClick={closeMenu}
                  className={
                    location.pathname === ROUTES.WHITEPAPER ? "active" : ""
                  }
                >
                  Whitepaper
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
