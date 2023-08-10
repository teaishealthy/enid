import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/use-theme';
import type { DivProps } from 'react-html-props';
import { useNavigate } from 'react-router-dom';

export default function SiteLayout({
  getStarted = true,
  children,
  ...divProps
}: DivProps & { getStarted?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div {...divProps}>
      <nav className="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-background px-9">
        <span
          role="button"
          tabIndex={0}
          aria-label="Go to home page"
          onClick={() => {
            navigate('/');
          }}
          className="text-2xl font-bold"
        >
          Enid
        </span>
        <div className="flex items-center justify-between space-x-4">
          {getStarted ? (
            <Button
              variant="outline"
              onClick={() => {
                navigate('/sign-up');
              }}
            >
              Get started
            </Button>
          ) : null}
          <Button
            className="aspect-square rounded-full"
            variant="outline"
            onClick={toggleTheme}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </Button>
        </div>
      </nav>
      {children}
    </div>
  );
}
