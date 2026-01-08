import React from "react";
import "../../styles/sections/Footer.css";
import discordIcon from "../../assets/discordIcon.png";
import twitterIcon from "../../assets/iconX.png";
import telegramIcon from "../../assets/telegramIcon.png";
import { Logo } from "../atoms/common";

const Footer: React.FC = () => {
  return (
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
            Play skill-based games, compete for real rewards in SOL, and join a
            thriving community of 250K players worldwide.
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
              <a
                href="https://embedded.games/whitepaper.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Whitepaper
              </a>
            </li>
          </ul>
        </nav>

        {/* Community icons */}
        <div className="ef-col ef-col--community">
          <h3 className="ef-community-title">Community</h3>
          <div className="ef-socials">
            <a
              className="ef-social-box"
              href="https://x.com/Embedded_Games"
              aria-label="X (Twitter)"
            >
              <img src={twitterIcon} alt="X" />
            </a>
            <a
              className="ef-social-box"
              href="https://discord.gg/y9TkSUXF6G"
              aria-label="Discord"
            >
              <img src={discordIcon} alt="Discord" />
            </a>
            <a
              className="ef-social-box"
              href="https://t.me/EmbeddedGames"
              aria-label="Telegram"
            >
              <img src={telegramIcon} alt="Telegram" />
            </a>
          </div>
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
          <a href="/terms" className="ef-legal-link">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
