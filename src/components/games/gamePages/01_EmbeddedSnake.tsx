import React from 'react';
import GamePage from '../GamePage';

const EmbeddedSnake: React.FC = () => {
  return (
    <GamePage
      gameId="01-embedded-snake"
      customContent={<div></div>}
    />
  );
};

export default EmbeddedSnake;
