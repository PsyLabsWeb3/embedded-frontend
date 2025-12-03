import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import History from './pages/History';
import GamesPvP from './pages/GamesPvP';
import GamesPvE from './pages/GamesPvE';
import Leaderboard from './pages/Leaderboard';
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
    path: '/leaderboard',
    element: <Leaderboard />,
  },
  {
    path: '/tournaments',
    element: <Tournaments />,
  },
  {
    path: '/embedded-game',
    element: <EmbeddedGame />,
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
