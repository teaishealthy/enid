import { UploadedFile } from '../pages/chat';
import {
    Flex,
    IconButton,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { Icon } from '@iconify/react';

export default function Attachment({
    file,
    onRemove,
}: {
    file: UploadedFile;
    onRemove: () => void;
}): JSX.Element {
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
                <IconButton
                    icon={<Icon icon="mdi:close" />}
                    aria-label="Remove attachment"
                    onClick={onRemove}
                />
            </PopoverContent>
        </Popover>
    );
}
