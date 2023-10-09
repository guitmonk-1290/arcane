import { app } from '@/src/firebase/clientApp';
import { Button, Flex, Box, Text } from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import CreateCommunityModal from '../Modal/CreateCommunity/CreateCommunityModal';

const HomeCreate: React.FC = () => {

    const auth = getAuth(app);
    const [user] = useAuthState(auth);
    const [openCommunityModal, setOpenCommunityModal] = useState(false);

    return (
        <>
            <CreateCommunityModal open={openCommunityModal} handleClose={() => setOpenCommunityModal(false)} />
            <Flex
                direction='column'
                bgImage="url(/images/pacHomeBan.jpeg)"
                p='6px 10px'
                borderRadius='5px'
                backgroundSize='fit'
                //height='200px'
                bgGradient="linear-gradient(to bottom, rgba(0,0,0,0.12), rgba(0,0,0,0.95)), url('images/pacHomeBan.jpeg')"
                mt={2}
            >

                <Text
                    fontSize='18pt'
                    mb={2}
                    fontWeight={600}
                    align='center'
                    color='gray.200'
                    bgGradient="linear(to-t, blue.900, blue.500)"
                >
                    arc / Home
                </Text>
                <Box p='10px 20px' ml='auto' mr='auto' alignSelf='center'>
                    <Button
                        variant='outline'
                        color='blue.200' _hover={{ color: "white" }}
                        height='30px' width='100%'
                        fontSize='9pt'
                        mb={2}
                    >
                        Create a Post
                    </Button>
                    <Button
                        variant='outline'
                        color='blue.200' _hover={{ color: "white" }}
                        height='30px' width='100%'
                        fontSize='9pt'
                        onClick={() => setOpenCommunityModal(true)}
                    >
                        Create a Community
                    </Button>
                </Box>
            </Flex>
        </>
    )
}
export default HomeCreate;