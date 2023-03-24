// Connector; basically a small screen to show while connecting to the server
import Chat from './chat';
import { Center, CircularProgress } from '@chakra-ui/react';
import { InstanceInfo, Message } from 'eludris-api-types/oprish';
import { IncomingMessage } from 'eludris-api-types/pandemonium';
import { StrictMode, memo, useEffect, useState } from 'react';
import { atom, useRecoilState } from 'recoil';

export const messagesState = atom<Message[]>({
    key: 'messages',
    default: [],
});

export const instanceInfoState = atom<InstanceInfo | null>({
    key: 'instanceInfo',
    default: null,
});

function _Connector() {
    const [messages, setMessages] = useRecoilState(messagesState);

    const [instanceInfo, setInstanceInfo] = useRecoilState(instanceInfoState);
    useEffect(() => {
        console.log('Fetching instance info');
        async function getData() {
            const request = await fetch('https://api.eludris.gay');
            const data = await request.json();
            setInstanceInfo(data);
            console.log(`Fetched instance info from '${request.url}'`);
        }
        getData();
    }, [setInstanceInfo]);

    const [ws, setWs] = useState<WebSocket | null>(null);
    const [interval, setIntervalValue] = useState<number | null>(null);
    const [, setWsState] = useState<WebSocket['readyState']>(
        WebSocket.CONNECTING,
    );

    useEffect(() => {
        if (ws !== null || instanceInfo === null) return;
        console.log('Connecting to Gateway');

        const newWs = new WebSocket(instanceInfo.pandemonium_url);
        newWs.onopen = () => {
            console.log(
                `Connected to Gateway at '${instanceInfo.pandemonium_url}'`,
            );
            newWs.send(JSON.stringify({ op: 'PING' }));
            setWsState(newWs.readyState);
        };
        newWs.addEventListener('message', (message) => {
            const data: IncomingMessage = JSON.parse(message.data);
            if (typeof data !== 'object' || data.op === 'PONG') {
                return;
            }
            setMessages((messages) =>
                messages.concat(JSON.parse(message.data).d),
            );
        });

        newWs.onclose = (event) => {
            setWsState(newWs.readyState);
            console.log(
                `Gateway closed with code '${event.code}' and reason '${event.reason}'` +
                    '\nReconnecting in one second if this was not intentional',
            );
            setTimeout(() => {
                setWs(null);
            }, 1000);
        };

        newWs.onerror = (error) => {
            console.error(error);
        };
        setWs(newWs);

        const interval = window.setInterval(() => {
            newWs.send(JSON.stringify({ op: 'PING' }));
        }, 45000);
        setIntervalValue(interval);
    }, [ws, messages, setMessages, instanceInfo]);

    useEffect(() => {
        return () => {
            if (
                ws === null ||
                ws.readyState !== WebSocket.OPEN ||
                interval === null
            )
                return;
            ws.close();
            clearInterval(interval);
        };
    }, [ws, interval]);

    if (ws?.readyState !== WebSocket.OPEN || instanceInfo === null) {
        return (
            <Center h="100%">
                <CircularProgress
                    color="purple.500"
                    isIndeterminate
                ></CircularProgress>
            </Center>
        );
    }
    // Strict mode can be safely added here because it will not cause the websocket to be reconnected

    return (
        <StrictMode>
            {' '}
            <Chat ws={ws}></Chat>
        </StrictMode>
    );
}

const Connector = memo(_Connector);
export default Connector;
