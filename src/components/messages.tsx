import { messagesState } from '../pages/connector';
import { Message } from './message';
import { Flex } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

export default function Messages() {
    const messages = useRecoilValue(messagesState);

    return (
        <Flex
            w={'clamp(200px, 90%, 70em)'}
            flexDir="column"
            h="100%"
            overflowY="scroll"
            className="no-scrollbar"
        >
            {messages.map((message, idx) => (
                <Message
                    key={message.content + message.author}
                    content={message.content}
                    author={message.author}
                    previousMessageHasSameAuthor={
                        messages[idx - 1]?.author === message.author
                    }
                    nextMessageHasSameAuthor={
                        messages[idx + 1]?.author === message.author
                    }
                />
            ))}
        </Flex>
    );
}
