import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { GatewayClient } from 'eludris.js';
import { Fragment, useEffect, useState } from 'react';

export default function GatewayDebuggerPortal({
  display,
  gateway,
  onClose,
}: {
  display: boolean;
  gateway: GatewayClient;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<
    { received: boolean; content: string }[]
  >([]);
  useEffect(() => {
    gateway.emitRawEvents = true;
    const receiveListener = (message: string) =>
      setMessages(messages => [
        ...messages,
        { received: true, content: message },
      ]);
    gateway.events.on('rawReceive', receiveListener);

    const sendListener = (message: string) =>
      setMessages(messages => [
        ...messages,
        { received: false, content: message },
      ]);
    gateway.events.on('rawSend', sendListener);

    return () => {
      gateway.events.removeListener('rawReceive', receiveListener);
      gateway.events.removeListener('rawSend', sendListener);
      gateway.emitRawEvents = false;
    };
  }, [gateway]);

  return (
    <Sheet
      open={display}
      onOpenChange={o => {
        if (!o) {
          onClose();
        }
      }}
    >
      <SheetContent className="min-w-[30vw]  py-10">
        <SheetHeader>
          <SheetTitle>GATEWAY DEBUGGER</SheetTitle>
        </SheetHeader>
        <div className="max-h-full overflow-y-scroll text-muted-foreground">
          {messages.map((message, idx) => (
            <Fragment key={idx}>
              <code className="whitespace-pre-wrap">
                {message.received ? '<' : '>'}
                {JSON.stringify(JSON.parse(message.content), null, 2)}
              </code>
              <hr></hr>
            </Fragment>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
