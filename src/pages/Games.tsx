import MainLayout from '../components/templates/MainLayout';
import PageHeader from '../components/molecules/PageHeader';
import { Link } from 'react-router-dom';
import './Games.css';

const gamesList = [
  { id: 1, title: 'Snake', path: '/game/01-snake' },
  { id: 2, title: 'Ping Pong', path: '/game/02-ping-pong' },
  { id: 3, title: 'Bubble Merge', path: '/game/03-bubble-merge' },
  { id: 4, title: 'Candy Sweet', path: '/game/04-candy-sweet' },
  { id: 5, title: 'Sort Puzzle', path: '/game/05-sort-puzzle' },
  { id: 6, title: 'Pipes Flood', path: '/game/06-pipes-flood' },
  { id: 7, title: 'Hover Racer', path: '/game/07-hover-racer' },
  { id: 8, title: 'Infinite Runner', path: '/game/08-infinite-runner' },
  { id: 9, title: 'Cake Mania', path: '/game/09-cake-mania' },
  { id: 10, title: 'Game 10', path: '/game/10-game-10' },
  { id: 11, title: 'Game 11', path: '/game/11-game-11' }
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
