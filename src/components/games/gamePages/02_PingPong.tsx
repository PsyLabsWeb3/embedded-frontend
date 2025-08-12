import React from 'react';
import GamePage from '../GamePage';

import './Games.module.css'

const PingPong: React.FC = () => {
  return (
    <GamePage 
      gameId="02-ping-pong"
      customContent={<div />}
    />
  );
};

export default PingPong;
