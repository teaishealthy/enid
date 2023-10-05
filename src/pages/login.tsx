import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import SiteLayout from '@/layouts/site';
import { restClient } from '@/lib/client-provider';
import { userLoginSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

export default function Login() {
  const form = useForm<z.infer<typeof userLoginSchema>>({
    resolver: zodResolver(userLoginSchema),
  });

  const navigate = useNavigate();

  return (
    <SiteLayout
      className="flex max-h-screen flex-col items-center"
      getStarted={false}
    >
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Login</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async loginInfo => {
              const sessionCreated = await restClient.createSession({
                client: 'enid',
                platform: 'web',
                ...loginInfo,
              });
              localStorage.setItem('session', JSON.stringify(sessionCreated));
              restClient.authToken = sessionCreated.token;
              navigate('/app');
            })}
            className="mt-12 w-[min(90%,30rem)] space-y-8"
          >
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="hello@enid.com" />
                  </FormControl>
                  <FormDescription>
                    Use either your username or email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="*********" type="password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <hr />

            <Button className="w-full" type="submit">
              Submit
            </Button>
          </form>
        </Form>
        <span className="mt-4 text-center text-sm">
          Don't have an account yet?{' '}
          <Link to="/sign-up" className="hover:underline">
            Sign up
          </Link>
        </span>
      </div>
    </SiteLayout>
  );
}
