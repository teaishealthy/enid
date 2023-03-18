import { Flex, Link, Text, useColorModeValue } from '@chakra-ui/react';
import Linkify from 'linkify-react';
import React, { useEffect, useRef } from 'react';

const renderLink = ({
    attributes,
    content,
}: {
    attributes: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    content: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}) => {
    const { href, ...props } = attributes;
    return (
        <Link href={href} color="teal.500" {...props}>
            {content}
        </Link>
    );
};

function _Message({
    content,
    author,
    previousMessageHasSameAuthor,
    nextMessageHasSameAuthor,
}: {
    content: string;
    author: string | undefined;
    previousMessageHasSameAuthor: boolean;
    nextMessageHasSameAuthor: boolean;
}) {
    const elevatedBackground = useColorModeValue('gray.100', 'gray.750');
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const borderRadiusTop = previousMessageHasSameAuthor
        ? 0
        : 'var(--chakra-radii-xl)';
    const borderRadiusBottom = nextMessageHasSameAuthor
        ? 0
        : 'var(--chakra-radii-xl)';

    return (
        <Flex
            ref={ref}
            flexDir="column"
            _hover={{ bg: elevatedBackground }}
            p={5}
            pb={nextMessageHasSameAuthor ? 1 : 2}
            pt={previousMessageHasSameAuthor ? 1 : 2}
            borderRadius={`${borderRadiusTop} ${borderRadiusTop} ${borderRadiusBottom} ${borderRadiusBottom}`}
            mt={previousMessageHasSameAuthor ? 0 : 2}
        >
            {!previousMessageHasSameAuthor && (
                <Text fontWeight="bold">{author}</Text>
            )}
            <Text whiteSpace="pre-line">
                <Linkify options={{ render: renderLink }}>{content}</Linkify>
            </Text>
        </Flex>
    );
}

export const Message = React.memo(_Message);
