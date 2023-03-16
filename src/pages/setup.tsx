import { usernameState } from './app';
import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Input,
    Link,
    Stack,
    Text,
    Tooltip,
    useColorMode,
} from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import { useRecoilState } from 'recoil';

export default function Setup() {
    const [, setUsername] = useRecoilState(usernameState);
    const [maybeUsername, setMaybeUsername] = useState<string>('');
    const ref = useRef<HTMLInputElement>(null);
    const { toggleColorMode } = useColorMode();
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
                        <Flex
                            direction={'row'}
                            align={'center'}
                            alignSelf={'center'}
                            position={'relative'}
                        >
                            <Input
                                ref={ref}
                                placeholder={'Username'}
                                borderRadius={'10px 0 0 10px'}
                                onKeyDown={(event) => {
                                    if (
                                        event.key === 'Enter' &&
                                        maybeUsername.length >= 3
                                    ) {
                                        setUsername(ref.current!.value);
                                    }
                                }}
                                onChange={(event) => {
                                    setMaybeUsername(event.target.value);
                                }}
                            ></Input>
                            <Tooltip
                                isDisabled={maybeUsername.length >= 3}
                                label={
                                    'Username must be at least 3 characters long'
                                }
                                aria-label="A tooltip"
                                placement="top"
                            >
                                <Button
                                    isDisabled={maybeUsername.length < 3}
                                    colorScheme={'purple'}
                                    bg={'purple.500'}
                                    rounded={'none'}
                                    color={'white'}
                                    borderRadius={'0 10px 10px 0'}
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
                            </Tooltip>
                        </Flex>
                        <Text as={'span'} color={'gray.500'} fontSize="xs">
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
