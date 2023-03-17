import ChatInput from '../components/chatinput';
import Messages from '../components/messages';
import NavBar from '../components/navbar';
import { Flex } from '@chakra-ui/react';

export interface UploadedFile {
    url: string;
    name: string;
}

function Chat({ ws }: { ws: WebSocket }): JSX.Element {
    return (
        <Flex flexDir="column" h="100%" w="100%" alignItems="center">
            <NavBar ws={ws} />
            <Messages />
            <ChatInput />
        </Flex>
    );
}

export default Chat;
