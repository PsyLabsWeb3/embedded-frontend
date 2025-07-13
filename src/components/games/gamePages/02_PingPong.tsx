import React from 'react';
import GamePage from '../GamePage';

const PingPong: React.FC = () => {
  return (
    <GamePage 
      gameId="02-ping-pong"
      customContent={<div></div>}
    />
  );
};

export default PingPong;
