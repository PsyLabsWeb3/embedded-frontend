import React from 'react';

interface GameCustomContentProps {
  title: string;
  description: string;
  leftIcon?: string;
  rightIcon?: string;
  infoCards?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  features?: string[];
  stats?: Array<{
    value: string;
    label: string;
  }>;
  className?: string;
}

const GameCustomContent: React.FC<GameCustomContentProps> = ({
  title,
  description,
  leftIcon,
  rightIcon,
  infoCards = [],
  features = [],
  stats = [],
  className = ''
}) => {
  return (
    <div className={`game-custom-content ${className}`}>
      {/* Title Header */}
      <div className="game-title-header">
        {leftIcon && <span className="game-title-icon">{leftIcon}</span>}
        <h3 className="game-title-text">{title}</h3>
        {rightIcon && <span className="game-title-icon">{rightIcon}</span>}
      </div>
      
      {/* Description */}
      <p className="game-description">{description}</p>
      
      {/* Info Cards Grid */}
      {infoCards.length > 0 && (
        <div className="game-info-grid">
          {infoCards.map((card, index) => (
            <div key={index} className="game-info-card">
              <div className="game-info-card-icon">{card.icon}</div>
              <h4 className="game-info-card-title">{card.title}</h4>
              <p className="game-info-card-description">{card.description}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Features Tags */}
      {features.length > 0 && (
        <div className="game-features">
          {features.map((feature, index) => (
            <span key={index} className="game-feature-tag">
              {feature}
            </span>
          ))}
        </div>
      )}
      
      {/* Stats Display */}
      {stats.length > 0 && (
        <div className="game-stats">
          {stats.map((stat, index) => (
            <div key={index} className="game-stat">
              <span className="game-stat-value">{stat.value}</span>
              <span className="game-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameCustomContent;
