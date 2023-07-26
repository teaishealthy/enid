import { Button } from '@/components/ui/button';
import {
  LucideLock,
  LucideMessageSquareDashed,
  LucideWallet,
} from 'lucide-react';
import { useTheme } from './use-theme';
// Button
function App() {
  const { theme, toggleTheme } = useTheme();

  const image =
    theme === 'light'
      ? 'linear-gradient(to top, rgb(255 255 255), rgb(0 0 0 / 0%)), url(https://source.unsplash.com/9wg5jCEPBsw/2400x1600)'
      : 'linear-gradient(to top, hsl(var(--background)), rgb(0 0 0 / 0%)), url(https://source.unsplash.com/u27Rrbs9Dwc/2400x1600)';
  return (
    <div>
      <div className="sticky top-0 z-50 flex h-16 items-center justify-between bg-inherit px-72">
        <span className="text-2xl font-bold">Enid</span>
        <Button
          className="aspect-square rounded-full"
          variant="outline"
          onClick={toggleTheme}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </Button>
      </div>
      <div
        className="flex h-[calc(100vh-9rem)] w-full flex-col items-center bg-cover bg-center bg-no-repeat pt-24"
        style={{
          backgroundImage: image,
        }}
      >
        <h1 className="text-5xl font-extrabold">Ready for freedom?</h1>
        <h2 className="mt-5 text-3xl font-medium">
          Enid is built for you. And only you.
        </h2>
        <div className="mt-28 flex items-center justify-center gap-10">
          <div className="flex min-h-full w-72 flex-col  items-center gap-4 text-center">
            <div className="rounded-full bg-background p-4">
              <LucideMessageSquareDashed strokeWidth={2.5} height={undefined} />
            </div>
            <span className="text-2xl font-medium ">Secure and private.</span>
            <span className="text-xl text-gray-800 dark:text-gray-200">
              Enid is built with privacy in mind. It uses the{' '}
              <a href="https://eludris.com/">Eludris</a> protocol to ensure your
              data is secure.
            </span>
          </div>

          <div className="flex min-h-full w-72 flex-col  items-center gap-4 text-center">
            <div className="rounded-full bg-background p-4">
              <LucideLock strokeWidth={2.5} height={undefined} />
            </div>
            <span className="text-2xl font-medium ">You own your data.</span>
            <span className="text-xl text-gray-800 dark:text-gray-200">
              Your data is end-to-end encrypted and only you can access it.
            </span>
          </div>

          <div className="flex min-h-full w-72 flex-col  items-center gap-4 text-center">
            <div className="rounded-full bg-background p-4">
              <LucideWallet strokeWidth={2.5} height={undefined} />
            </div>
            <span className="text-2xl font-medium ">Free forever.</span>
            <span className="text-xl text-gray-800 dark:text-gray-200">
              Enid is free and open source. No ads, no fees, no subscriptions.
              Ever.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
