import uploadFile from '../api/effis';
import Emoji from '../components/emoji';
import { usernameState } from './app';
import { messagesState } from './connector';
import {
    Divider,
    Flex,
    IconButton,
    Link,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Text,
    Textarea,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import React, { useRef, useState } from 'react';
import { useRecoilState } from 'recoil';

interface UploadedFile {
    url: string;
    name: string;
}

function Attachment({ file, onRemove }: { file: UploadedFile, onRemove: () => void }): JSX.Element {
    const moreElevatedBackground = useColorModeValue('gray.200', '#1d2430');

    return (
        <Popover trigger="hover" placement="top-end" offset={[10, -20]}>
            <PopoverTrigger>
                <Flex
                    flexDir="column"
                    justifyContent="space-between"
                    h="100%"
                    m="5px"
                    backgroundColor={moreElevatedBackground}
                    rounded="2xl"
                    p={3}
                    style={{
                        aspectRatio: '1/1',
                    }}
                >
                    <Flex alignItems="center" justifyContent="center" h="100%">
                        <Icon
                            icon="mdi:file"
                            style={{
                                fontSize: '100',
                            }}
                        />
                    </Flex>
                    <Text fontSize="sm">{file.name}</Text>
                </Flex>
            </PopoverTrigger>
            <PopoverContent w="min-content">
                        <IconButton icon={<Icon icon="mdi:close" />} aria-label="Remove attachment" onClick={onRemove} />
            </PopoverContent>
        </Popover>
    );
}

function Chat({ ws }: { ws: WebSocket }): JSX.Element {
    const [messages, setMessages] = useRecoilState(messagesState);
    const [attachments, setAttachments] = useState<UploadedFile[]>([]);
    const [username, setUsername] = useRecoilState(usernameState);

    if (username === null) {
        throw new Error('Username is null'); // This will never happen because of the way the app is structured
    }

    const toggleColorModeIcon = useColorModeValue('🌞', '🌚');
    const elevatedBackground = useColorModeValue('gray.100', 'gray.750');

    const contentRef = useRef<HTMLTextAreaElement>(null);

    const { toggleColorMode } = useColorMode();

    return (
        <Flex flexDir="column" h="100%" w="100%" alignItems="center">
            <Flex
                p={5}
                justifyContent="space-between"
                alignItems="center"
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
                <Flex flexDir="row" h="100%" alignItems="center">
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
                    <IconButton
                        variant="ghost"
                        borderRadius="full"
                        aria-label="leave chat"
                        onClick={() => {
                            setUsername(null);
                            setMessages([]);
                            ws.close();
                        }}
                        icon={
                            <Text as="span">
                                <Emoji emoji="🏃" />
                            </Text>
                        }
                    ></IconButton>
                </Flex>
            </Flex>
            <Flex
                w={'clamp(200px, 90%, 70em)'}
                flexDir="column"
                h="100%"
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
                w={'clamp(200px, 90%, 70em)'}
                mb={'1em'}
                mt={'10px'}
                p={2}
                flexDir="column"
                rounded={'2xl'}
                bg={elevatedBackground}
            >
                {attachments.length > 0 && (
                    <>
                        <Flex
                            px="12px"
                            h="13em"
                            pb={5}
                            gap={5}
                            overflowX="scroll"
                            overflowY="hidden"
                            className={'no-scrollbar'}
                        >
                            {attachments.map((file) => (
                                <Attachment key={file.url} file={file} onRemove={() => setAttachments((attachments) => attachments.filter((attachment) => attachment.url !== file.url))} />
                            ))}
                        </Flex>
                        <Divider />
                    </>
                )}
                <Flex w={'100%'}>
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
                                const file = (
                                    event.target as HTMLInputElement | null
                                )?.files?.[0];
                                if (!file) {
                                    return;
                                }
                                uploadFile('https://cdn.eludris.gay', file)
                                    .then((data) => {
                                        if (contentRef.current === null) return;
                                        setAttachments((attachments) =>
                                            attachments.concat({
                                                url: `https://cdn.eludris.gay/${data.id}`,
                                                name: file.name,
                                            }),
                                        );
                                        input.remove();
                                    })
                                    .catch((error) => {
                                        console.error(error);
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
                            if (contentRef.current === null) return;
                            if (event.key !== 'Enter') {
                                return;
                            }
                            event.preventDefault();
                            if (event.shiftKey) {
                                contentRef.current.value += '\n';
                                contentRef.current.rows += 1;
                                return;
                            }
                            createMessage(contentRef, attachments, username);
                            setAttachments([]);
                        }}
                        onChange={() => {
                            if (contentRef.current === null) return;
                            contentRef.current.rows = Math.max(
                                contentRef.current.value.split('\n').length,
                                1,
                            );
                        }}
                    ></Textarea>
                    <IconButton
                        variant="ghost"
                        borderRadius="full"
                        aria-label="send"
                        onClick={() => {
                            createMessage(contentRef, attachments, username);
                            setAttachments([]);
                        }}
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
    attachments: UploadedFile[],
    username: string,
) {
    if (contentRef.current === null) return;

    let content = contentRef.current.value;
    if (attachments.length > 0) {
        content += '\n' + attachments.map((file) => file.url).join('\n');
    }
    fetch('https://api.eludris.gay/messages', {
        method: 'POST',
        body: JSON.stringify({
            content,
            author: username,
        }),
    });
    contentRef.current.value = '';
    contentRef.current.rows = 1;
}

function _Message({ content, author }: { content: string; author: string }) {
    const elevatedBackground = useColorModeValue('gray.100', 'gray.750');

    return (
        <Flex
            flexDir="column"
            _hover={{ bg: elevatedBackground }}
            rounded={'2xl'}
            p={5}
        >
            <Text fontWeight="bold">{author}</Text>
            <Text whiteSpace="pre-line">{content}</Text>
        </Flex>
    );
}

const Message = React.memo(_Message);
