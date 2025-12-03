import MainLayout from '../components/templates/MainLayout';
import PageHeader from '../components/molecules/PageHeader';
import { Link } from 'react-router-dom';
import './Games.css';
import { pvpGames } from '../data/gameSections';

const GamesPvP = () => (
  <MainLayout>
    <PageHeader 
      title="PvP Games" 
      description="Choose from our collection of blockchain-powered multiplayer games and start earning rewards"
    />
    
    <div className="games-container">
      {pvpGames.map((game) => (
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

export default GamesPvP;
