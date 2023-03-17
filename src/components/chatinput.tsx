import uploadFile from '../api/effis';
import { usernameState } from '../pages/app';
import { UploadedFile } from '../pages/chat';
import Attachment from './attachment';
import {
    Divider,
    Flex,
    IconButton,
    Textarea,
    useColorModeValue,
} from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';

function createMessage(
    textarea: HTMLTextAreaElement | null,
    attachments: UploadedFile[],
    username: string,
) {
    if (textarea === null) return;

    let content = textarea.value;
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
    textarea.value = '';
    textarea.rows = 1;
}

export default function ChatInput() {
    const contentRef = useRef<HTMLTextAreaElement>(null);

    const [attachments, setAttachments] = useState<UploadedFile[]>([]);
    const username = useRecoilValue(usernameState)!;
    const elevatedBackground = useColorModeValue('gray.100', 'gray.750');

    return (
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
                            <Attachment
                                key={file.url}
                                file={file}
                                onRemove={() =>
                                    setAttachments((attachments) =>
                                        attachments.filter(
                                            (attachment) =>
                                                attachment.url !== file.url,
                                        ),
                                    )
                                }
                            />
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
                    icon={<Icon icon="material-symbols:add-circle-outline" />}
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
                    _focusVisible={{
                        border: 'inherit',
                    }}
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

                        createMessage(
                            contentRef.current,
                            attachments,
                            username,
                        );
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
                        createMessage(
                            contentRef.current,
                            attachments,
                            username,
                        );
                        setAttachments([]);
                    }}
                    icon={<Icon icon="mdi:send" />}
                ></IconButton>
            </Flex>
        </Flex>
    );
}
