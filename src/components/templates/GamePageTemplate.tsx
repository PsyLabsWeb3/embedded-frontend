import React from 'react';
import Navbar from '../sections/Navbar';
import GameInfoBox from '../games/GameInfoBox';
import GameDetailsBox from '../games/GameDetailsBox';
import OnChainMetricsBox from '../games/OnChainMetricsBox';
import './GamePageTemplate.css';

interface GamePageTemplateProps {
  gameTitle: string;
  gameComponent: React.ReactNode;
  paymentComponent?: React.ReactNode;
  instructions?: string[];
  gameInfo?: React.ReactNode;
  backgroundImage?: string;
  customContent?: React.ReactNode;
}

const GamePageTemplate: React.FC<GamePageTemplateProps> = ({
  gameTitle,
  gameComponent,
  paymentComponent,
  instructions = [],
  gameInfo,
  backgroundImage
}) => {
  return (
    <div className="game-page">
      <Navbar />
      
      <div className="game-page-content">
        <div className="game-central-container">
          <div className="game-container">
            {backgroundImage && (
              <div 
                className="game-container-background"
                style={{
                  backgroundImage: `url(${backgroundImage})`
                }}
              />
            )}
            <div className="game-inner-container">
              {backgroundImage && (
                <div 
                  className="game-inner-background"
                  style={{
                    backgroundImage: `url(${backgroundImage})`
                  }}
                />
              )}
              <div className="game-content">
                {gameComponent}
              </div>
            </div>
            
            <div className="game-title-inside">
              <h1 className="game-title-simple">{gameTitle}</h1>
            </div>
          </div>
        </div>
        
        {/* Game Features Row */}
        <div className="game-features-row">
          <div className="feature-item">
            <img src="/src/assets/multiplayer_icon.svg" alt="Multiplayer" className="feature-icon" />
            <span className="feature-label">Multiplayer</span>
          </div>
          <div className="feature-item">
            <img src="/src/assets/realtime_icon.png" alt="Realtime" className="feature-icon" />
            <span className="feature-label">Realtime</span>
          </div>
          <div className="feature-item">
            <img src="/src/assets/pvp_icon.png" alt="PvP" className="feature-icon" />
            <span className="feature-label">PvP</span>
          </div>
        </div>
        
        {paymentComponent && (
          <div className="payment-section">
            {paymentComponent}
          </div>
        )}
        {/* Game Info Box - layout general */}
        <GameInfoBox />
        <GameDetailsBox />
        <OnChainMetricsBox />
        
        {false && (instructions.length > 0 || gameInfo) && (
          <div className="game-info-section">
            {instructions.length > 0 && (
              <div className="game-instructions">
                <h3>Instructions:</h3>
                <ul>
                  {instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {gameInfo && (
              <div className="game-additional-info">
                {gameInfo}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePageTemplate;
