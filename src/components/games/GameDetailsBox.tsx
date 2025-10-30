import React from "react";
import "./GameDetailsBox.css";

interface GameDetailsBoxProps {
  instructions?: string[];
}

const GameDetailsBox: React.FC<GameDetailsBoxProps> = ({ instructions = [] }) => (
  <div className="game-details-box">
    <h3 className="game-details-title">Game Instructions</h3>
    <div className="game-info-text">
      {instructions.length > 0 ? (
        <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
          {instructions.map((instruction, index) => (
            <li key={index} style={{ marginBottom: '0.5rem' }}>
              {instruction}
            </li>
          ))}
        </ul>
      ) : (
        "Game instructions will be available soon."
      )}
    </div>
  </div>
);

export default GameDetailsBox;