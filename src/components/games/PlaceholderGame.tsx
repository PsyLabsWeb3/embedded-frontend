import React from 'react';
import './PlaceholderGame.css';

interface PlaceholderGameProps {
  className?: string;
}

const PlaceholderGame: React.FC<PlaceholderGameProps> = ({ className }) => {
  return (
    <div className={`placeholder-game ${className || ''}`}>
      <div className="placeholder-content">
        {/* Empty - title is shown outside the game container */}
      </div>
    </div>
  );
};

export default PlaceholderGame;
