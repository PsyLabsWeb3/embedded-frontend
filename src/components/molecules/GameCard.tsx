import '../../styles/sections/GameCard.css';
import { useNavigate } from 'react-router-dom';

type GameCardProps = {
  title: string;
  image: string; // Ruta relativa a la imagen
  className?: string;
  slug: string;
};

const GameCard = ({ title, image, className, slug }: GameCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navegar a la página del juego basado en el slug
    if (slug === 'snake') {
      navigate('/snake2048');
    } else {
      // Para otros juegos, puedes agregar más rutas aquí
      console.log(`Navegando a ${slug}`);
    }
  };

  return (
    <div className="game-card-outer-wrapper" onClick={handleClick} style={{ cursor: 'pointer' }}>
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
};

export default GameCard;
