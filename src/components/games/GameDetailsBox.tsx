import React from "react";
import "./GameDetailsBox.css";

// const details = [
//   { label: "Developer:", value: "Psy Labs" },
//   { label: "Community Rating:", value: "Lorem Ipsum" },
//   { label: "Release:", value: "July 2025" },
//   { label: "Technology:", value: "Lorem Ipsum; Lorem Ipsum" },
//   { label: "Platforms:", value: "Lorem Ipsum" },
//   { label: "Result Verification:", value: "Lorem Ipsum" },
//   { label: "Rewards:", value: "Lorem Ipsum" },
// ];

const GameDetailsBox: React.FC = () => (
  <div className="game-details-box">
    <h3 className="game-details-title">Game Instructions</h3>
    {/* <div className="game-details-list"> */}
    <div className="game-info-text">
      Eliminate the opposing player with weapons obtained from the arena. Each
      player begins with a standard weapon and may pick up additional weapons
      from the ground. The first player to win two matches is the overall
      winner.
      {/* {details.map((item, idx) => (
        <div className="game-details-row" key={idx}>
          <span className="game-details-label">{item.label}</span>
          <span className="game-details-value">{item.value}</span>
        </div>
      ))} */}
    </div>
  </div>
);

export default GameDetailsBox;
