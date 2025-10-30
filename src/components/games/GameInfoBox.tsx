import React from "react";
import "./GameInfoBox.css";

interface GameInfoBoxProps {
  description?: string;
}

const GameInfoBox: React.FC<GameInfoBoxProps> = ({ description }) => (
  <div className="game-info-box">
    <h3 className="game-info-title">Game Info</h3>
    <p className="game-info-text">
      {description || "Game information will be available soon."}
    </p>
  </div>
);

export default GameInfoBox;
