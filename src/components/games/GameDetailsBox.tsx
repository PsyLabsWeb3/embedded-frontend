import React from "react";
import "./GameDetailsBox.css";

const details = [
  { label: "Developer:", value: "Psy Labs" },
  { label: "Community Rating:", value: "Lorem Ipsum" },
  { label: "Release:", value: "July 2025" },
  { label: "Technology:", value: "Lorem Ipsum; Lorem Ipsum" },
  { label: "Platforms:", value: "Lorem Ipsum" },
  { label: "Result Verification:", value: "Lorem Ipsum" },
  { label: "Rewards:", value: "Lorem Ipsum" },
];

const GameDetailsBox: React.FC = () => (
  <div className="game-details-box">
    <h3 className="game-details-title">Game Details</h3>
    <div className="game-details-list">
      {details.map((item, idx) => (
        <div className="game-details-row" key={idx}>
          <span className="game-details-label">{item.label}</span>
          <span className="game-details-value">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

export default GameDetailsBox;
