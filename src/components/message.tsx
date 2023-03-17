import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

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

export const Message = React.memo(_Message);
