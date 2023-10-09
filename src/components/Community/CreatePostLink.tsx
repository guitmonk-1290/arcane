import { Flex, Icon, Input, Text, border } from '@chakra-ui/react';
import React from 'react';
import { MdBorderColor } from 'react-icons/md';
import {IoImageOutline} from "react-icons/io5"
import {BsLink45Deg} from "react-icons/bs"
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { app } from '@/src/firebase/clientApp';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authModalState } from '@/src/atoms/authModalAtom';
import { postModalState } from "@/src/atoms/postModalAtom" 
import PostModal from '../Modal/Post/PostModal';
import { getFirestore } from 'firebase/firestore';
import useDirectory from '@/src/hooks/useDirectory';
import { Community, communityState } from '@/src/atoms/communitiesAtom';
import useCommunityData from '@/src/hooks/useCommunityData';


const CreatePostLink:React.FC = () => {

    const router = useRouter();
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    const [user] = useAuthState(auth);
    const setAuthModalState = useSetRecoilState(authModalState);
    const setPostModalState = useSetRecoilState(postModalState);
    const {toggleMenuOpen} = useDirectory();

    const onClick = () => {
        if (!user) {
            setAuthModalState({ open: true, view: "login" })
            return;
        }

        // const { communityId } = router.query;
        // router.push(`/arc/${communityId}/submit`)
        const communityId = router.query;
        if (communityId.communityId) {
            setPostModalState({ open: true, view: 'post' })
            return;
        }

        toggleMenuOpen();
    }

    return (
        <>
            { user && 
            <PostModal 
                user={user} 
                firestore={firestore}
            />}
            <Flex
                justifyContent='space-evenly'
                align='center'
                bg='white'
                height='56px'
                border='1px solid'
                borderColor='gray.300'
                p={2}
                mb={4}
            >
                <Input 
                    placeholder='Create Post'
                    fontSize='10pt'
                    _placeholder={{ color: "gray.500" }}
                    _hover={{
                        outline: "none",
                        bg: "white",
                        border: "1px solid",
                        borderColor: "blue.500"
                    }}
                    bg='gray.100'
                    height='36px'
                    mr={4}
                    onClick={onClick}
                />
                <Icon 
                    as={IoImageOutline}
                    fontSize={24}
                    mr={4}
                    color='gray.500'
                    cursor='pointer'
                />
                <Icon 
                    as={BsLink45Deg}
                    fontSize={24}
                    color='gray.500'
                    cursor='pointer'
                />
            </Flex>
        </>
    )
}
export default CreatePostLink;