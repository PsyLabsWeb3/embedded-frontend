import React from 'react';
import GamePage from '../GamePage';
import Snake2048Game from '../Snake2048';
import './Games.module.css'

const BubbleMerge: React.FC = () => {
  return (
    <GamePage 
      gameId="03-bubble-merge"
      customContent={<div className='game-container '> <Snake2048Game /></div>}
    />
  );
};

export default BubbleMerge;
