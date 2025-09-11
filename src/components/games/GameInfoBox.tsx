import React from "react";
import "./GameInfoBox.css";

const GameInfoBox: React.FC = () => (
  <div className="game-info-box">
    <h3 className="game-info-title">Game</h3>
    <p className="game-info-text">
      Game description Lorem Ipsum is simply dummy text of the printing and
      typesetting industry. Lorem Ipsum has been the industry's standard dummy
      text ever since the 1500s, when an unknown printer took a galley of type
      and scrambled it to make a type specimen book. It has survived not only
      five centuries, but also the leap into electronic typesetting, remaining
      essentially unchanged. It was popularised in the 1960s with the release of
      Letraset sheets containing.
    </p>
  </div>
);

export default GameInfoBox;
