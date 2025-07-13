import React from 'react';
import './PlaceholderGame.css';

interface PlaceholderGameProps {
  gameName: string;
  className?: string;
}

const PlaceholderGame: React.FC<PlaceholderGameProps> = ({ gameName, className }) => {
  return (
    <div className={`placeholder-game ${className || ''}`}>
      <div className="placeholder-content">
        {/* Contenido temporalmente vacío */}
      </div>
    </div>
  );
};

export default PlaceholderGame;
