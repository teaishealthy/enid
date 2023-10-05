import GatewayDebuggerPortal from '@/components/gateway-debugger';
import { Input } from '@/components/ui/input';
import { authenticateClient, restClient } from '@/lib/client-provider';
import { Progress } from '@/components/ui/progress';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  InstanceInfo,
  Message,
  User,
  ServerPayloadPresenceUpdate,
  ServerPayloadAuthenticated,
} from 'eludris-api-types/v0.4.0-alpha1';
import { GatewayClient, ROUTES } from 'eludris.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EludrisAvatar from '@/components/avatar';
import Settings from '@/components/settings';
import { Button } from '@/components/ui/button';
import { SettingsIcon } from 'lucide-react';
import Profile from '@/components/profile';

function mapMap<K, V, R>(map: Map<K, V>, cb: (key: K, val: V) => R): R[] {
  const out = new Array(map.size);
  let i = 0;
  map.forEach((val, key) => {
    out[i++] = cb(key, val);
  });
  return out;
}

export default function App() {
  console.log('rendering app');
  const navigate = useNavigate();
  const gateway = useMemo(
    () => new GatewayClient({ rest: restClient, logEvents: true }),
    [],
  );

  const [messages, setMessages] = useState<Message[]>([]);
  const [debug, setDebug] = useState(false);
  const [me, setMe] = useState<null | User>(null);
  const [instanceInfo, setInstanceInfo] = useState<null | InstanceInfo>(null);
  const [users, setUsers] = useState<Map<string, User>>(new Map());
  const [openPage, setOpenPage] = useState<'settings' | 'app'>('app');
  // id -> presence
  const requested = useRef(false);

  useEffect(() => {
    if (gateway.ws !== null) {
      return;
    }
    const messageCreateListener = (message: Message) => {
      setMessages(messages => [...messages, message]);
    };
    const authenticatedListener = (
      payload: ServerPayloadAuthenticated['d'],
    ) => {
      setUsers(users => {
        const newUsers = new Map(users);
        for (const user of payload.users) {
          // @ts-expect-error - Waiting for a fix by the eludris team
          newUsers.set(user.id, user);
        }
        // @ts-expect-error - Waiting for a fix by the eludris team
        newUsers.set(payload.user.id, payload.user);
        return newUsers;
      });
    };
    const presenceUpdateListener = (
      _presence: ServerPayloadPresenceUpdate['d'],
    ) => {
      // TODO
    };

    gateway.events
      .once('AUTHENTICATED', data => {
        setMe(data.user);
      })
      .on('MESSAGE_CREATE', messageCreateListener)
      .on('PRESENCE_UPDATE', presenceUpdateListener)
      .on('AUTHENTICATED', authenticatedListener)
      .on('USER_UPDATE', user => {
        setUsers(users => {
          // @ts-expect-error - Waiting for a fix by the eludris team
          users.set(user.id, user);
          return new Map(users);
        });
      });

    const get = async () => {
      if (requested.current) {
        return;
      }
      requested.current = true;
      console.log('requesting instance info');
      restClient.instanceInfo = await restClient.getInstanceInfo({
        withRateLimits: false,
      });
      ROUTES.effisUrl = restClient.instanceInfo.effis_url;
      setInstanceInfo(restClient.instanceInfo);
      await gateway.connect();
    };
    get();

    return () => {
      gateway.events.removeListener('MESSAGE_CREATE', messageCreateListener);
      gateway.events.removeListener('PRESENCE_UPDATE', presenceUpdateListener);
      gateway.events.removeListener('AUTHENTICATED', authenticatedListener);

      gateway.ws?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const pressedKeys: Set<string> = new Set();

    document.body.addEventListener('keydown', function (evt) {
      pressedKeys.add(evt.key);
      console.log(pressedKeys);

      if (
        pressedKeys.has('Shift') &&
        pressedKeys.has('D') &&
        pressedKeys.has('G')
      ) {
        setDebug(true);
      }

      if (pressedKeys.has('Escape') && openPage === 'settings') {
        setOpenPage('app');
      }
    });

    document.body.addEventListener('keyup', function (evt) {
      pressedKeys.delete(evt.key);
    });
  }, []);

  if (!restClient.authToken && !authenticateClient()) {
    navigate('/login');
    return null;
  }

  if (!instanceInfo || !me) {
    const value = (instanceInfo ? 33 : 0) + (me ? 33 : 0);
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex h-1/2 w-1/2 flex-col items-center justify-center">
          <Progress value={value} />
        </div>
      </div>
    );
  }

  return (
    <main className="flex h-screen w-screen flex-col justify-between">
      <GatewayDebuggerPortal
        gateway={gateway}
        display={debug}
        onClose={() => setDebug(false)}
      />
      {openPage === 'settings' && (
        <Settings me={me} setMe={setMe} instanceInfo={instanceInfo} />
      )}

      <div
        className={` h-full justify-between ${
          openPage === 'settings' ? 'hidden' : 'flex'
        }`}
      >
        <div className="flex w-full flex-col justify-between p-5">
          <div className="flex h-full flex-col">
            {messages.map((message, idx) => (
              <div
                className="flex   gap-3 rounded-md px-2
              py-3 hover:bg-muted"
                key={idx}
              >
                <EludrisAvatar
                  effis_url={instanceInfo.effis_url}
                  author={message.author}
                />
                <div className="flex flex-col" key={idx}>
                  <div className="font-medium">{message.author.username}</div>
                  <div>{message.content}</div>
                </div>
              </div>
            ))}
          </div>
          <Input
            className="m-5 w-[none]"
            autoFocus
            onKeyDown={evt => {
              if (evt.key === 'Enter') {
                restClient.createMessage({
                  content: evt.currentTarget.value,
                });
                evt.currentTarget.value = '';
              }
            }}
          />
        </div>

        <div className="w-[25%] p-5">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setOpenPage('settings')}
          >
            <SettingsIcon className="h-6 w-6" />
          </Button>
          {mapMap(users, (id, user) => {
            return (
              <Popover>
                <PopoverTrigger className="w-full ">
                  <div
                    className="flex w-full items-center justify-normal gap-3 rounded-md px-2 py-2 text-start hover:bg-muted"
                    key={id}
                  >
                    <EludrisAvatar
                      effis_url={instanceInfo.effis_url}
                      author={user}
                    />
                    <div className="flex flex-col">
                      <div className="font-medium">{user.username}</div>
                      <p className="max-w-full  overflow-hidden overflow-ellipsis whitespace-nowrap">
                        {user.status.text}
                      </p>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[25vw] min-w-[25wv] ">
                  <Profile
                    className="border-none p-2"
                    user={user}
                    instanceInfo={instanceInfo}
                  />
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
      </div>
    </main>
  );
}
