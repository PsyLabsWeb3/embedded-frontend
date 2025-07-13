import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import History from './pages/History';
import Games from './pages/Games';
import Leaderboard from './pages/Leaderboard';
import Rewards from './pages/Rewards';
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
    path: '/games',
    element: <Games />,
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
    path: '/embedded-game',
    element: <EmbeddedGame />,
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
