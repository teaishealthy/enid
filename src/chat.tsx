import uploadFile from './api/effis';
import Emoji from './components/emoji';
import {
    Flex,
    IconButton,
    Link,
    Text,
    Textarea,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import { IncomingMessage } from 'eludris-api-types/pandemonium';
import React, { useEffect, useRef, useState } from 'react';

function Chat({ username }: { username: string }) {
    const [messages, setMessages] = useState<
        { content: string; author: string }[]
    >([]);

    const toggleColorModeIcon = useColorModeValue('🌞', '🌚');
    const elevatedBackground = useColorModeValue('gray.100', 'gray.750');

    const contentRef = useRef<HTMLTextAreaElement>(null);

    const { toggleColorMode } = useColorMode();

    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        if (ws !== null) {
            return;
        }
        console.log('rendering chat');
        const newWs = new WebSocket('wss://ws.eludris.gay');
        newWs.onmessage = (message) => {
            if (message === null) return;
            let data: IncomingMessage = JSON.parse(message.data);
            if (
                data === null ||
                typeof data !== 'object' ||
                data.op === 'PONG'
            ) {
                return;
            }

            const payload = data.d;

            const maybeLastMessage = messages.at(-1);
            if (
                maybeLastMessage &&
                maybeLastMessage.author === payload.author
            ) {
                const copy = [...messages];
                copy.pop();
                maybeLastMessage.content += '\n' + payload.content;
                setMessages(copy.concat(maybeLastMessage));
            } else {
                setMessages((messages) =>
                    messages.concat(JSON.parse(message.data).d),
                );
            }
        };

        newWs.onclose = () => {
            console.warn('WebSocket was closed unexpectedly. Reconnecting...');
            setWs(null);
        };

        setWs(newWs);

        return () => {
            newWs.close();
        };
    }, []);

    return (
        <Flex flexDir="column" h="100%" w="100%" alignItems="center">
            <Flex
                p={5}
                justifyContent="space-between"
                mb={5}
                w={'100%'}
                bg={elevatedBackground}
            >
                <Flex flexDir="column">
                    <Text fontSize="3xl" mb={0} fontWeight="bold">
                        Eludris
                    </Text>
                    <Text fontSize="md">
                        Connected to the{' '}
                        <Link color={'teal.500'} href="https://eludris.gay">
                            main
                        </Link>{' '}
                        instance as{' '}
                        <Text color={'teal.500'} as="span">
                            {username}
                        </Text>
                    </Text>
                </Flex>
                <Flex flexDir="column" h="100%" justifyContent="center">
                    <IconButton
                        variant="ghost"
                        borderRadius="full"
                        aria-label="toggle color mode"
                        onClick={toggleColorMode}
                        icon={
                            <Text as="span">
                                {<Emoji emoji={toggleColorModeIcon} />}
                            </Text>
                        }
                    ></IconButton>
                </Flex>
            </Flex>
            <Flex flexDir="column" h="100%" w="70em">
                <Flex
                    flexDir="column"
                    h="100%"
                    gap={5}
                    overflowY="scroll"
                    className="no-scrollbar"
                >
                    {messages.map((message) => (
                        <Message
                            key={message.content + message.author}
                            content={message.content}
                            author={message.author}
                        />
                    ))}
                </Flex>
                <Flex
                    mb={'1em'}
                    mt={'10px'}
                    p={2}
                    rounded={'2xl'}
                    bg={elevatedBackground}
                >
                    <IconButton
                        variant="ghost"
                        borderRadius="full"
                        aria-label="attach"
                        icon={
                            <Icon icon="material-symbols:add-circle-outline" />
                        }
                        onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.onchange = (event) => {
                                const file = (event.target as HTMLInputElement)
                                    .files![0];
                                uploadFile(
                                    'https://cdn.eludris.gay',
                                    file,
                                ).then((url) => {
                                    contentRef.current!.value += `https://cdn.eludris.gay/${url.id}`;
                                    input.remove();
                                });
                            };
                            input.click();
                        }}
                    />
                    <Textarea
                        _focusVisible={{ border: 'inherit' }}
                        rounded={'2xl'}
                        placeholder="Message Eludris"
                        border={'none'}
                        resize={'none'}
                        rows={1}
                        disabled={username.length < 2}
                        ref={contentRef}
                        id={'input'}
                        onKeyDown={(event) => {
                            if (event.key !== 'Enter') {
                                return;
                            }
                            event.preventDefault();
                            if (event.shiftKey) {
                                contentRef.current!.value += '\n';
                                contentRef.current!.rows += 1;
                                return;
                            }

                            createMessage(contentRef, username);
                        }}
                        onChange={(event) => {
                            contentRef.current!.rows = Math.max(
                                contentRef.current!.value.split('\n').length,
                                1,
                            );
                        }}
                    ></Textarea>
                    <IconButton
                        variant="ghost"
                        borderRadius="full"
                        aria-label="send"
                        onClick={() => createMessage(contentRef, username)}
                        icon={<Icon icon="mdi:send" />}
                    ></IconButton>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Chat;

function createMessage(
    contentRef: React.RefObject<HTMLTextAreaElement>,
    username: string,
) {
    fetch('https://api.eludris.gay/messages', {
        method: 'POST',
        body: JSON.stringify({
            content: contentRef.current!.value,
            author: username,
        }),
    });
    contentRef.current!.value = '';
    contentRef.current!.rows = 1;
}

function _Message({ content, author }: { content: string; author: string }) {
    return (
        <Flex flexDir="column">
            <Text fontWeight="bold">{author}</Text>
            <Text whiteSpace="pre-line">{content}</Text>
        </Flex>
    );
}

const Message = React.memo(_Message);
