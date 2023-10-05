import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { User } from 'eludris-api-types/v0.4.0-alpha1';
import { Check, Loader2, SendHorizonal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRef, useState } from 'react';
import { restClient } from '@/lib/client-provider';
import { Label } from '@/components/ui/label';

export default function Verification({
  me,
  setMe,
  className,
}: {
  me: User;
  setMe: (user: User) => void;
  className?: string;
}) {
  const codeRef = useRef<HTMLInputElement>(null);
  const [wasSuccessful, setWasSuccessful] = useState<
    boolean | null | undefined
  >(undefined);
  let iconToShow = <SendHorizonal />;

  if (wasSuccessful === true) {
    iconToShow = <Check />;
  } else if (wasSuccessful === false) {
    iconToShow = <X />;
  } else if (wasSuccessful === null) {
    iconToShow = <Loader2 />;
  }

  return (
    <p className={className}>
      <div className="flex flex-col gap-2">
        <Label>Verification</Label>

        <span className="flex items-center gap-2">
          {me.verified === true ? <Check /> : <X />} Your account is{' '}
          {me.verified !== true && 'not'} verified{' '}
        </span>
        {me.verified !== true && (
          <Dialog>
            <DialogTrigger className="w-fit">
              <Button className="w-fit">Verify now</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Verify your account</DialogTitle>
                <DialogDescription>
                  Enter the verification code sent to your email address, make
                  sure to check your spam folder.
                  <div className="mt-3 flex items-center">
                    <Input
                      ref={codeRef}
                      disabled={
                        wasSuccessful === null || wasSuccessful === true
                      }
                      placeholder="123 456"
                      className="w-fit"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="ml-3 rounded-full"
                      onClick={async () => {
                        if (codeRef.current === null) return;

                        setWasSuccessful(null);
                        try {
                          await restClient.verifyUser({
                            code: parseInt(
                              codeRef.current.value.replace(/\s/g, ''),
                            ),
                          });
                        } catch {
                          setWasSuccessful(false);
                          return;
                        }

                        const newMe = await restClient.getUser({
                          userId: me.id,
                        });
                        if (newMe.verified === true) {
                          setWasSuccessful(true);
                        } else {
                          setWasSuccessful(false);
                        }
                        setMe(newMe);
                      }}
                    >
                      {iconToShow}
                    </Button>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </p>
  );
}
