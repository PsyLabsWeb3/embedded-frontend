import '../../styles/sections/GameCard.css';

type GameCardProps = {
  title: string;
  image: string; // Ruta relativa a la imagen
  className?: string;
};

const GameCard = ({ title, image, className }: GameCardProps) => (
  <div className="game-card-outer-wrapper">
    <div className={`game-card-glow-left${className ? ' ' + className : ''}`}></div>
    <div className={`game-card-glow-right${className ? ' ' + className : ''}`}></div>
    <div className={`game-card-bottom-glow${className ? ' ' + className : ''}`}></div>
    <div
      className={`game-card game-cover-placeholder ${className || ''}`}
      style={{ backgroundImage: `url(${image})` }}
    >
      <span className="game-card-title">{title}</span>
    </div>
  </div>
);

export default GameCard;
