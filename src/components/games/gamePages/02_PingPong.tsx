import React from 'react';
import GamePage from '../GamePage';
import PingPongGame from '../PingPong';
import './Games.module.css'

const PingPong: React.FC = () => {
  return (
    <GamePage 
      gameId="02-ping-pong"
      customContent={<div />}
      // customContent={<div className='game-container ' >
      //     <PingPongGame  />
      // </div>}
    />
  );
};

export default PingPong;
