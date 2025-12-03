import MainLayout from '../components/templates/MainLayout';
import PageHeader from '../components/molecules/PageHeader';
import { Link } from 'react-router-dom';
import './Games.css';
import { pveGames } from '../data/gameSections';

const GamesPvE = () => (
  <MainLayout>
    <PageHeader 
      title="PvE Games" 
      description="Take on the environment in our single-player blockchain games"
    />
    
    <div className="games-container">
      {pveGames.map((game) => (
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

export default GamesPvE;
