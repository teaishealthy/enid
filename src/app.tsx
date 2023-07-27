import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landing-page';
import NotFound from './pages/404';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
