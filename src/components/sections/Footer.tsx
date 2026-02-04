import React, { useState } from "react";
import TermsModal from "../molecules/TermsModal";
import "../../styles/sections/Footer.css";
import "../../styles/no-hover.css";
import discordIcon from "../../assets/discordIcon.png";
import twitterIcon from "../../assets/iconX.png";
import telegramIcon from "../../assets/telegramIcon.png";
import { Logo } from "../atoms/common";
import AdvertiseModal from "../organisms/AdvertiseModal";
import rumIcon from "../../assets/rumbleIcon1x.png";
import tiktokIcon from "../../assets/tiktokIcon1x.png";
import instagramIcon from "../../assets/instagramIcon1x.png";
import youtubeIcon from "../../assets/youtubeIcon1x.png";

const Footer: React.FC = () => {
  const [showTerms, setShowTerms] = useState(false);

  const handleTermsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowTerms(true);
  };
  const [isAdvertiseModalOpen, setIsAdvertiseModalOpen] = useState(false);

  const handleAdvertiseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdvertiseModalOpen(true);
  };

  const handleCloseAdvertiseModal = () => {
    setIsAdvertiseModalOpen(false);
  };

  const handleCloseTerms = () => setShowTerms(false);

  return (
    <>
      <footer className="ef-footer" aria-labelledby="ef-footer-heading">
        <div className="ef-footer-top container mx-container">
          {/* Brand and description */}
          <div className="ef-col ef-col--brand">
            <div className="ef-brand-row">
              <div className="ef-brand-logo" aria-hidden="true">
                <Logo />
              </div>
              {/* <div className="ef-brand-text">
              <span className="ef-brand-primary">Embedded</span>
              <span className="ef-brand-accent">Games</span>
            </div> */}
            </div>
            <p className="ef-desc">
              Play skill-based games, compete for real rewards in SOL, and join
              a thriving community of 250K players worldwide.
            </p>
          </div>

          {/* Platform links */}
          <nav className="ef-col ef-col--links" aria-label="Platform">
            <h3 id="ef-footer-heading" className="ef-links-title">
              Platform
            </h3>
            <ul className="ef-links-list">
              <li>
                <a href="/games-pve">Games</a>
              </li>
              <li>
                <a href="#key-features-heading">How It Works</a>
              </li>
              <li>
                <a href="/leaderboard">Leaderboard</a>
              </li>
              <li>
                <a href="/faqs">FAQs</a>
              </li>

              {/* <li>
                <a
                  href="https://embedded.games/whitepaper.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Whitepaper
                </a>
              </li> */}
            </ul>
          </nav>

          {/* Community icons */}
          <div className="ef-col ef-col--community">
            <h3 className="ef-community-title">Community</h3>
            <div className="ef-socials">
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                <a
                  className="ef-social-box"
                  href="https://x.com/Embedded_Games"
                  aria-label="X (Twitter)"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={twitterIcon} alt="X" />
                </a>
                <a
                  className="ef-social-box"
                  href="https://discord.gg/y9TkSUXF6G"
                  aria-label="Discord"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={discordIcon} alt="Discord" />
                </a>
                <a
                  className="ef-social-box"
                  href="https://t.me/EmbeddedGames"
                  aria-label="Telegram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={telegramIcon} alt="Telegram" />
                </a>
                <a
                  className="ef-social-box"
                  href="https://rumble.com/user/Embedded_Games_Fun"
                  aria-label="Rumble"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={rumIcon} alt="Rumble" />
                </a>
                <a
                  className="ef-social-box"
                  href="https://www.tiktok.com/@embeddedgames?is_from_webapp=1&sender_device=pc"
                  aria-label="TikTok"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={tiktokIcon} alt="TikTok" />
                </a>
                <a
                  className="ef-social-box"
                  href="https://www.instagram.com/embedded.games?igsh=MWx2anJoc3hocWluNw=="
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={instagramIcon} alt="Instagram" />
                </a>
                <a
                  className="ef-social-box"
                  href="https://www.youtube.com/@Embedded_Games"
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={youtubeIcon} alt="YouTube" />
                </a>
              </div>
            </div>
            <button
              className="sidebar__item sidebar__item--button no-hover"
              aria-label="Advertise with us"
              onClick={handleAdvertiseClick}
              type="button"
              style={{ marginTop: "20px", padding: "0" }}
            >
              <span className="sidebar__text">Contact Us</span>
            </button>
          </div>
        </div>

        {/* Divider lines */}
        <div className="ef-divider container mx-container" aria-hidden="true" />
        <div
          className="ef-divider ef-divider--thin container mx-container"
          aria-hidden="true"
        />

        {/* Bottom row */}
        <div className="ef-footer-bottom container mx-container">
          <div className="ef-copyright">
            © 2026 Embedded Games. All rights reserved.
          </div>
          <div className="ef-legal-links">
            <a href="/privacy" className="ef-legal-link">
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="ef-legal-link"
              onClick={handleTermsClick}
            >
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
      {showTerms && (
        <TermsModal isOpen={showTerms} onClose={handleCloseTerms} forceShow />
      )}
      {isAdvertiseModalOpen && (
        <AdvertiseModal
          isOpen={isAdvertiseModalOpen}
          onClose={handleCloseAdvertiseModal}
        />
      )}
    </>
  );
};

export default Footer;
