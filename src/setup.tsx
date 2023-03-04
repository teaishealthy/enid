import {
    Box,
    Button,
    Container,
    Heading,
    IconButton,
    Input,
    Link,
    Spacer,
    Stack,
    Text,
    color,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react';
import { Icon, InlineIcon } from '@iconify/react';
import { useRef, useState } from 'react';

export default function Setup({
    setUsername,
}: {
    setUsername: (username: string) => void;
}) {
    const ref = useRef<HTMLInputElement>(null);
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <>
            <Container maxW={'3xl'}>
                <Stack
                    alignItems={'center'}
                    as={Box}
                    textAlign={'center'}
                    spacing={{ base: 8, md: 14 }}
                    py={{ base: 20, md: 36 }}
                >
                    <Heading
                        fontWeight={600}
                        fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
                        lineHeight={'110%'}
                    >
                        Secure chatting? <br />
                        <Text
                            as={'span'}
                            color={'purple.500'}
                            onClick={() => {
                                toggleColorMode();
                            }}
                        >
                            Eludris.
                        </Text>
                    </Heading>
                    <Text color={'gray.500'} textAlign={'center'} fontSize="xl">
                        Eludris is a{' '}
                        <Link
                            color="teal.500"
                            href="https://en.wikipedia.org/wiki/Free_and_open-source_software"
                        >
                            FOSS
                        </Link>{' '}
                        <Link
                            color="teal.500"
                            href="https://en.wikipedia.org/wiki/Federation_(information_technology)"
                        >
                            federated
                        </Link>
                        ,{' '}
                        <Link
                            color="teal.500"
                            href="https://en.wikipedia.org/wiki/End-to-end_encryption"
                        >
                            End-To-End-Encrypted
                        </Link>{' '}
                        Discord x Reddit mesh-like social media platform where
                        the priority is for it to be truly yours.
                    </Text>
                    <Stack width={'fit-content'}>
                        <Stack
                            direction={'row'}
                            spacing={3}
                            align={'center'}
                            alignSelf={'center'}
                            position={'relative'}
                        >
                            <Input
                                ref={ref}
                                placeholder={'Username'}
                                rounded={'2xl'}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        setUsername(ref.current!.value);
                                    }
                                }}
                            ></Input>
                            <Button
                                colorScheme={'purple'}
                                bg={'purple.500'}
                                rounded={'2xl'}
                                color={'white'}
                                px={14}
                                rightIcon={<Icon icon={'bx:lock-alt'} />}
                                _hover={{
                                    bg: 'purple.600',
                                }}
                                onClick={() => {
                                    setUsername(ref.current!.value);
                                }}
                            >
                                Secure your chats
                            </Button>
                        </Stack>
                        <Text
                            as={'span'}
                            color={'gray.500'}
                            fontSize="xs"
                            textAlign={'right'}
                        >
                            You will connect to the{' '}
                            <Link color={'teal.500'} href="https://eludris.gay">
                                main
                            </Link>{' '}
                            instance.
                        </Text>
                    </Stack>
                </Stack>
            </Container>
        </>
    );
}
