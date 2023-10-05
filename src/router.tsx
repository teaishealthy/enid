import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from 'react-router-dom';
import LandingPage from './pages/landing-page';
import NotFound from './pages/404';
import SignUp from './pages/sign-up';
import Login from './pages/login';
import App from './pages/app';
import { authenticateClient } from './lib/client-provider';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    loader: async () => {
      if (authenticateClient()) {
        return redirect('/app');
      }
      return null;
    },
  },
  { path: '/sign-up', element: <SignUp /> },
  { path: '/login', element: <Login /> },
  {
    path: '/app',
    element: <App />,
    loader: async () => {
      if (!authenticateClient()) {
        return redirect('/login');
      }
      return null;
    },
  },
  { path: '*', element: <NotFound /> },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
