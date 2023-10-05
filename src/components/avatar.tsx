import { User } from 'eludris-api-types/v0.4.0-alpha1';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function EludrisAvatar({
  effis_url,
  author,
  className,
  avatarOverride,
}: {
  effis_url: string;
  className?: string;
  author: User;
  avatarOverride?: string;
}) {
  const avatar = avatarOverride ?? `${effis_url}avatars/${author.avatar}`;
  return (
    <Avatar className={cn('aspect-square h-12 w-12', className)}>
      <AvatarImage src={avatar} />
      <AvatarFallback className="h-full w-full">
        <div className="flex h-full items-center justify-center text-xl font-medium">
          {author.username[0]}
        </div>
      </AvatarFallback>
    </Avatar>
  );
}
