import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/use-theme';
import type { DivProps } from 'react-html-props';

export default function SiteLayout({ children, ...divProps }: DivProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div {...divProps}>
      <div className="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-background px-9 ">
        <span className="text-2xl font-bold">Enid</span>
        <Button
          className="aspect-square rounded-full"
          variant="outline"
          onClick={toggleTheme}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </Button>
      </div>
      {children}
    </div>
  );
}
