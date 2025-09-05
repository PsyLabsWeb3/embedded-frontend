import React from 'react';
import Navbar from '../sections/Navbar';
import './GamePageTemplate.css';

interface GamePageTemplateProps {
  gameTitle: string;
  gameComponent: React.ReactNode;
  paymentComponent?: React.ReactNode;
  instructions?: string[];
  gameInfo?: React.ReactNode;
  customContent?: React.ReactNode;
}

const GamePageTemplate: React.FC<GamePageTemplateProps> = ({
  gameTitle,
  gameComponent,
  paymentComponent,
  instructions = [],
  gameInfo,
  customContent
}) => {
  return (
    <div className="game-page">
      <Navbar />
      
      <div className="game-page-content">
        <div className="game-page-header">
          <h1 className="game-title">{gameTitle}</h1>
        </div>
        
        <div className="game-container">
          {gameComponent}
        </div>
        
        {paymentComponent && (
          <div className="payment-section">
            {paymentComponent}
          </div>
        )}
        
        {customContent && (
          <div className="custom-content-section">
            {customContent}
          </div>
        )}
        
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
