import {
  LucideLock,
  LucideMessageSquareDashed,
  LucideWallet,
} from 'lucide-react';
import { useTheme } from '../lib/use-theme';
import SiteLayout from '../layouts/site';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
// Button
export default function LandingPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  if (localStorage.getItem('session')) {
    navigate('/app', {
      replace: true,
    });
  }

  const image =
    theme === 'light'
      ? 'linear-gradient(to top, rgb(255 255 255), rgb(0 0 0 / 0%)), url(https://source.unsplash.com/9wg5jCEPBsw/2400x1600)'
      : 'linear-gradient(to top, hsl(var(--background)), rgb(0 0 0 / 0%)), url(https://source.unsplash.com/u27Rrbs9Dwc/2400x1600)';
  return (
    <SiteLayout
      className="flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: image,
      }}
    >
      <div className="flex w-full flex-col items-center pt-24">
        <h1 className="text-center text-5xl font-extrabold">
          Ready for freedom?
        </h1>
        <h2 className="mt-5 text-center text-3xl font-medium">
          Enid is built for you. And only you.
        </h2>
        <div className=" mt-28 flex flex-col items-center justify-center gap-10 lg:flex-row">
          <div className="flex min-h-full w-72 flex-col items-center gap-4  text-center sm:w-[30rem] lg:w-72">
            <div className="rounded-full bg-background p-4">
              <LucideMessageSquareDashed strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-medium ">Secure and private.</span>
            <span className="text-xl text-gray-800 dark:text-gray-200">
              Enid is built with privacy in mind. It uses the{' '}
              <a href="https://eludris.com/">Eludris</a> protocol to ensure your
              data is secure.
            </span>
          </div>

          <div className="flex min-h-full w-72 flex-col items-center gap-4  text-center sm:w-[30rem] lg:w-72">
            <div className="rounded-full bg-background p-4">
              <LucideLock strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-medium ">You own your data.</span>
            <span className="text-xl text-gray-800 dark:text-gray-200">
              Your data is end-to-end encrypted and only you can access it.
            </span>
          </div>

          <div className="flex min-h-full w-72 flex-col items-center gap-4  text-center sm:w-[30rem] lg:w-72">
            <div className="rounded-full bg-background p-4">
              <LucideWallet strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-medium ">Free forever.</span>
            <span className="text-xl text-gray-800 dark:text-gray-200">
              Enid is free and open source. No ads, no fees, no subscriptions.
              Ever.
            </span>
          </div>
        </div>
        <Button
          className="mt-5 rounded-lg px-5 py-6 text-lg"
          onClick={() => {
            navigate('/login');
          }}
        >
          Get started
        </Button>
        <div className="mt-16 flex max-w-3xl flex-col items-center gap-4 p-10 pt-0 text-justify ">
          <img src="https://eludris.com/das_ding.svg" className="h-24 w-24" />
          <h2 className="text-3xl font-medium ">Enid is built on Eludris.</h2>
          <span className="text-xl text-gray-800 dark:text-gray-200">
            Eludris is a federated, open-source social media protocol that
            combines elements of Discord and Reddit with a strong focus on user
            privacy and ownership. It offers end-to-end encryption and aims to
            be accessible to all users, even those unfamiliar with its privacy
            features.
          </span>
          <span className=" text-xl text-gray-800 dark:text-gray-200">
            Enid manages your Eludris account and allows you to access your
            communities and messages in a simple, easy-to-use interface.
          </span>
        </div>
      </div>
    </SiteLayout>
  );
}
