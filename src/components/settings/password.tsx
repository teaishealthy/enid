import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { restClient } from '@/lib/client-provider';
import { Label } from '@/components/ui/label';

export default function Password() {
  const form = useForm();

  return (
    <div className="flex flex-col gap-2">
      <Label>Password</Label>
      <Dialog>
        <DialogTrigger className="w-fit">
          <Button className="w-fit">Change Password</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change your password</DialogTitle>
            <DialogDescription className="flex flex-col gap-3">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(async () => {
                    try {
                      await restClient.updateUser({
                        password: form.getValues('old-password'),
                        new_password: form.getValues('new-password'),
                      });
                    } catch (e) {
                      return;
                    }
                  })}
                  className="mt-4 w-[min(90%,30rem)] space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="old-password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="new-password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button className="w-full" type="submit">
                    Submit
                  </Button>
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
