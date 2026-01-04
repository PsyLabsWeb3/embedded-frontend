import MainLayout from '../components/templates/MainLayout';
import PageHeader from '../components/molecules/PageHeader';
import { Link } from 'react-router-dom';
import './Games.css';
import { freeGames } from '../data/gameSections';

const GamesFree = () => (
  <MainLayout>
    <PageHeader 
      title="Free to Play Games" 
      description="Enjoy our collection of free-to-play blockchain games"
    />
    
    <div className="games-container">
      {freeGames.map((game) => (
        <Link 
          key={game.id}
          to={game.path}
          className="game-link"
        >
          <div className="game-card">
            <h3 className="game-title text-center">
              {game.title}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  </MainLayout>
);

export default GamesFree;
