import React from "react";
import "./GameInfoBox.css";

interface GameInfoBoxProps {
  description?: string;
}

const GameInfoBox: React.FC<GameInfoBoxProps> = ({ description }) => (
  <div className="game-info-box">
    <h3 className="game-info-title">Game Info</h3>
    <p className="game-info-text">
      {description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
    </p>
  </div>
);

export default GameInfoBox;
