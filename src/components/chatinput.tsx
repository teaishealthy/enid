import uploadFile from '../api/effis';
import { usernameState } from '../pages/app';
import { instanceInfoState } from '../pages/connector';
import Attachment from './attachment';
import {
    Divider,
    Flex,
    IconButton,
    Textarea,
    useColorModeValue,
} from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import { InstanceInfo } from 'eludris-api-types/oprish';
import React, { useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';

async function createMessage(
    instanceInfo: InstanceInfo,
    textarea: HTMLTextAreaElement | null,
    attachments: File[],
    username: string,
) {
    if (textarea === null) return;

    let content = textarea.value;
    if (attachments.length > 0) {
        const uploadedFiles = await Promise.all(
            attachments.map((file) => uploadFile(instanceInfo.effis_url, file)),
        );
        content +=
            '\n' +
            uploadedFiles
                .map((file) => `${instanceInfo.effis_url}/${file.id}`)
                .join('\n');
    }
    fetch(`${instanceInfo.oprish_url}/messages`, {
        method: 'POST',
        body: JSON.stringify({
            content,
            author: username,
        }),
    });
    textarea.value = '';
    textarea.rows = 1;
}

function _ChatInput() {
    const contentRef = useRef<HTMLTextAreaElement>(null);

    const instanceInfo = useRecoilValue(instanceInfoState)!;

    const [attachments, setAttachments] = useState<File[]>([]);
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
                                key={file.name + file.size} // Best we can do
                                file={file}
                                onRemove={() =>
                                    setAttachments((attachments) =>
                                        attachments.filter(
                                            (attachment) => attachment !== file,
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

                            setAttachments((attachments) => [
                                ...attachments,
                                file,
                            ]);
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
                            instanceInfo,
                            contentRef.current,
                            attachments,
                            username,
                        );
                        if (attachments.length > 0) {
                            setAttachments([]);
                        }
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
                            instanceInfo,
                            contentRef.current,
                            attachments,
                            username,
                        );
                        if (attachments.length > 0) {
                            setAttachments([]);
                        }
                    }}
                    icon={<Icon icon="mdi:send" />}
                ></IconButton>
            </Flex>
        </Flex>
    );
}

const ChatInput = React.memo(_ChatInput);
export default ChatInput;
