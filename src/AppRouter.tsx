import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import History from './pages/History';
import GamesPvP from './pages/GamesPvP';
import GamesPvE from './pages/GamesPvE';
import GamesFree from './pages/GamesFree';
import Leaderboard from './pages/Leaderboard';
import Rewards from './pages/Rewards';
import Whitepaper from './pages/Whitepaper';
import Tournaments from './pages/Tournaments';
import EmbeddedGame from './pages/EmbeddedGame';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/history',
    element: <History />,
  },
  {
    path: '/games-pve',
    element: <GamesPvE />,
  },
  {
    path: '/games-pvp',
    element: <GamesPvP />,
  },
  {
    path: '/games-free',
    element: <GamesFree />,
  },
  {
    path: '/leaderboard',
    element: <Leaderboard />,
  },
  {
    path: '/rewards',
    element: <Rewards />,
  },
  {
    path: '/tournaments',
    element: <Tournaments />,
  },
  {
    path: '/whitepaper',
    element: <Whitepaper />,
  },
  {
    path: '/embedded-game',
    element: <EmbeddedGame />,
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
