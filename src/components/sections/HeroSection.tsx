import "../../styles/theme.css";
import "../../styles/utilities.css";
import "../../styles/sections/HeroSection.css";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";

// Figma hero gallery assets (temporary URLs; replace with local later)
const imgRectangle24 = "/032bc56d-58d9-4895-90d3-b26b7dd694d8.png";
const imgRectangle25 = "/7d9b2811-8214-4a5f-b03e-77026acbfe6a.png";
const imgRectangle26 = "/556df02d-0732-4c94-9214-841e9f66931e.png";
const imgRectangle27 = "/40bf7dfb-4113-4f8f-a55d-ec5791269008.png";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleStartPlaying = () => {
    navigate(ROUTES.GAMES_PVE);
  } 

  return (
    <section className="hero-section section" data-name="Hero Section" data-node-id="3307:1736">
      <div className="hero-section__grid">
        {/* Left content column */}
        <div className="hero-section__content" data-node-id="3307:1813">
          {/* Badge pill row */}
          <div className="hero-section__pill" aria-label="Platform highlights">
            <ul className="hero-section__pill-list" role="list">
              <li role="listitem"><span className="hero-section__pill-dot" aria-hidden="true">◉</span> Free Games</li>
              <li role="listitem">Leaderboards</li>
              <li role="listitem">No accounts</li>
              <li role="listitem">Just Fun</li>
            </ul>
          </div>

          {/* Title with green emphasis per Figma */}
          <h1 className="hero-title" aria-label="Play. Win. Level up.">
            <span className="hero-title__white">Play</span>
            <span className="hero-title__green">.</span>
            <span className="hero-title__white">&nbsp;Win</span>
            <span className="hero-title__green">.</span>
            <span className="hero-title__green">&nbsp;Level up.</span>
          </h1>

          {/* Description */}
          <p className="hero-section__subtitle">
            Welcome to Embedded Games.
            <br />
            Play free browser games or step into competitive matches when you’re ready.
            <br />
            Climb the leaderboard where top players win monthly rewards.
          </p>

          {/* CTA buttons */}
          <div className="hero-section__buttons">
            <button
              className="hero-section__cta hero-section__cta--primary"
              onClick={handleStartPlaying}
            >
              Start Playing
            </button>
            <a
              className="hero-section__cta hero-section__cta--outline-purple"
              href="/whitepaper.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Whitepaper
            </a>
          </div>

          {/* Desktop hero stats row */}
          <div className="hero-section__stats" aria-label="Platform stats">
            <span className="hero-stats__item hero-stats__item--strong">250k+</span>
            <span className="hero-stats__label">players</span>
            <span className="hero-stats__sep" aria-hidden="true"></span>
            <span className="hero-stats__item">$735.52 distributed</span>
            <span className="hero-stats__dot hero-stats__dot--red" aria-hidden="true"></span>
            <span className="hero-stats__item">Top 500 Paid Monthly</span>
          </div>

        
        </div>

        {/* Right gallery column */}
        <aside className="hero-gallery" aria-label="Featured games">
          <div className="hero-gallery__grid">
            <figure className="hero-gallery__item hero-gallery__item--main">
              <img src={imgRectangle24} alt="Embedded Wars" />
              <figcaption>Embedded Wars</figcaption>
            </figure>
            <figure className="hero-gallery__item hero-gallery__item--top-right">
              <img src={imgRectangle25} alt="Asteroids" />
              <figcaption>Asteroids</figcaption>
            </figure>
            <figure className="hero-gallery__item hero-gallery__item--mid-right">
              <img src={imgRectangle26} alt="Smugglers Run" />
              <figcaption>Smugglers Run</figcaption>
            </figure>
            <figure className="hero-gallery__item hero-gallery__item--bottom">
              <img src={imgRectangle27} alt="Cyber Arena" />
              <figcaption>Cyber Arena</figcaption>
            </figure>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default HeroSection;
