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
import { userCreateSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

export default function SignUp() {
  const form = useForm<z.infer<typeof userCreateSchema>>({
    resolver: zodResolver(userCreateSchema),
  });

  const navigate = useNavigate();

  return (
    <SiteLayout
      className="flex max-h-screen flex-col items-center"
      getStarted={false}
    >
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Sign Up</h1>
        <p className="mt-2 text-muted-foreground">
          Secure conversations, private connections.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async userCreate => {
              const user = await restClient.createUser(userCreate);
              const session = await restClient.createSession({
                client: 'enid',
                identifier: user.username,
                platform: 'web',
                password: userCreate.password,
              });
              localStorage.setItem('session', JSON.stringify(session));
              restClient.authToken = session.token;
              navigate('/app');
            })}
            className="mt-12 w-[min(90%,30rem)] space-y-8"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="enid" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="hello@enid.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="*********"
                        type="password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <hr />
            <p className="!mt-4 text-sm text-muted-foreground">
              You can login later with either your username or email.
            </p>
            <Button className="!mt-4 w-full" type="submit">
              Submit
            </Button>
          </form>
        </Form>
        <span className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="hover:underline">
            Login
          </Link>
        </span>
      </div>
    </SiteLayout>
  );
}
