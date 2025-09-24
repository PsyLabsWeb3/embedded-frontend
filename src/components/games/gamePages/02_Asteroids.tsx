import React from 'react';
import GamePage from '../GamePage';

import './Games.module.css'

const Asteroids: React.FC = () => {
  return (
    <GamePage 
      gameId="02-asteroids"
      customContent={<div />}
    />
  );
};

export default Asteroids;
