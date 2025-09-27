import React from "react";
import "./GameInfoBox.css";

const GameInfoBox: React.FC = () => (
  <div className="game-info-box">
    <h3 className="game-info-title">Game Info</h3>
    <p className="game-info-text">
     In 2248, mega-corporations rule
      Earth, vying to control ‘Aetherion’, the rare fuel enabling
      faster-than-light travel. Synthesised using red mercury - found deep
      within certain planets - Aetherion fuels an interstellar economy.
      Smugglers, and five rival factions (mega-corporations) battle for
      dominance to control its supply and the interstellar economy. Embedded
      Wars takes place on a mining planet where these factions battle it out for
      control of resources.
    </p>
  </div>
);

export default GameInfoBox;
