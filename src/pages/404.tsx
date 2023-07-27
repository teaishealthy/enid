import { Button } from '@/components/ui/button';
import SiteLayout from '@/layouts/site';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <SiteLayout className="h-screen">
      <div className="flex h-[80%] flex-col items-center justify-center">
        <h1 className="text-5xl font-extrabold">404</h1>
        <h2 className="mt-5 text-3xl font-medium">Page not found</h2>
        <Button
          className="mt-5"
          variant="outline"
          onClick={() => navigate('/')}
        >
          Go back?
        </Button>
      </div>
    </SiteLayout>
  );
}
