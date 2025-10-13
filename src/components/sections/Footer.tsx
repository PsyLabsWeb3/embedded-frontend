import React from "react";
import "../../styles/sections/Footer.css";
import discordIcon from "../../assets/discordIcon.png";
import twitterIcon from "../../assets/iconX.png";
import telegramIcon from "../../assets/telegramIcon.png";
import { Logo } from "../atoms/common";

const Footer: React.FC = () => {
  return (
    <footer className="ef-footer">
      <div className="ef-footer-inner">
        <div className="ef-footer-left">
          <div className="ef-logo">
              <Logo />
      
            {/* <span className="ef-brand">Embedded</span> */}
          </div>
          <div className="ef-copy">@ Embedded Games 2025 All rights<br/>reserved</div>
          <div className="ef-powered">Powered By Psylabs</div>
        </div>

        <div className="ef-footer-center" />

        <div className="ef-footer-right">
          <a className="ef-link" href="https://embedded.games/wp-content/uploads/2025/06/Embedded-Whitepaper.pdf" target="_blank" rel="noreferrer">White Paper</a>
          <div className="ef-social-title">Social Media:</div>
          <div className="ef-social-icons">
            <a href="https://discord.com/invite/a2XR7QRh" aria-label="discord" className="ef-social"> 
              <img src={discordIcon} alt="discord" />
            </a>
            <a href="https://x.com/Embedded_Games" aria-label="twitter" className="ef-social">
              <img src={twitterIcon} alt="twitter" />
            </a>
            <a href="https://t.me/EmbeddedGames" aria-label="telegram" className="ef-social">
              <img src={telegramIcon} alt="telegram" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
