import MainLayout from '../components/templates/MainLayout';
import PageHeader from '../components/molecules/PageHeader';
import { Link } from 'react-router-dom';
import './Games.css';

const gamesList = [
  { id: 3, title: 'Embedded Wars', path: '/game/03-embedded-wars' },
  // { id: 1, title: 'Snake', path: '/game/01-snake' },
  // { id: 2, title: 'Asteroids', path: '/game/02-asteroids' }
];

const Games = () => (
  <MainLayout>
    <PageHeader 
      title="Games" 
      description="Choose from our collection of blockchain-powered games and start earning rewards"
    />
    
    <div className="games-container">
      {gamesList.map((game) => (
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

export default Games;
