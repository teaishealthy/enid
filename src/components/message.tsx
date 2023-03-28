import { Box, Flex, Link, Text, useColorModeValue } from '@chakra-ui/react';
import Linkify from 'linkify-react';
import React, { useEffect, useRef } from 'react';

interface Embed {
    html: string;
    width?: number | null;
    height?: number | null;
    version: string;
    provider_name: 'Spotify';
    provider_url: 'https://spotify.com';
    type: 'rich';
    title: string;
    thumbnail_url?: string | null;
    thumbnail_width?: number | null;
    thumbnail_height?: number | null;
}

function _SpotfiyEmbed({ url }: { url: string }) {
    const [embed, setEmbed] = React.useState<null | Embed>(null);

    React.useEffect(() => {
        fetch(`https://open.spotify.com/oembed?url=${url}`)
            .then((response) => response.json())
            .then((data) => setEmbed(data));
    }, [url]);

    if (embed === null) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(embed.html, 'text/html');
    const iframe = doc.querySelector('iframe');
    iframe!.height = '80px';
    iframe!.width = '70%';

    return (
        <>
            <Link href={url} color="teal.500" isExternal>
                {url}
            </Link>
            <Box
                dangerouslySetInnerHTML={{ __html: iframe?.outerHTML ?? '' }}
            />
        </>
    );
}

const SpotfiyEmbed = React.memo(_SpotfiyEmbed);

const renderLink = ({
    attributes,
    content,
}: {
    attributes: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    content: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}) => {
    const { href, ...props }: { href: string; [key: string]: any } = attributes; // eslint-disable-line @typescript-eslint/no-explicit-any

    const hrefUrl = new URL(href);

    if (hrefUrl.hostname === 'open.spotify.com') {
        return <SpotfiyEmbed url={href} />;
    }

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
