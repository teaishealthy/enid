import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landing-page';
import NotFound from './pages/404';
import SignUp from './pages/sign-up';
import Login from './pages/login';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/app" element={<div>App</div>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
