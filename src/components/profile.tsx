import { InstanceInfo, User } from 'eludris-api-types/v0.4.0-alpha1';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import EludrisAvatar from '@/components/avatar';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';

export default function Profile({
  user,
  instanceInfo,
  avatarOverride,
  className,
}: {
  user: User;
  instanceInfo: InstanceInfo;
  avatarOverride?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-lg border bg-card px-7 py-5 text-card-foreground shadow-sm',
        className,
      )}
    >
      <div className="flex justify-between">
        <div className="flex items-center">
          <div className="mr-3 h-12 w-12 rounded-full shadow-sm">
            <EludrisAvatar
              avatarOverride={avatarOverride}
              effis_url={instanceInfo.effis_url}
              author={user}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex font-medium">
              {typeof user.display_name === 'string' &&
              user.display_name.length !== 0
                ? user.display_name
                : user.username}
            </div>
            {typeof user.display_name === 'string' &&
              user.display_name.length !== 0 &&
              user.username}
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex h-10 w-10 items-center justify-center font-mono font-medium">
                <span>{user.social_credit}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                This is your social credit. It is Eludris' user rating system.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {!!user.bio?.length && (
        <>
          <hr />
          <div>
            <Label>Bio</Label>
            <p>{user.bio}</p>
          </div>
        </>
      )}
    </div>
  );
}
