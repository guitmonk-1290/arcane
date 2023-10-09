import { Community, communityState } from '@/src/atoms/communitiesAtom';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { SlCalender } from "react-icons/sl"
import { BsDot } from "react-icons/bs"
import { Box, Button, Divider, Flex, Icon, Link, Stack, Text, Image, Spinner } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { Timestamp, doc, getFirestore, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import { Router, useRouter } from 'next/router';
import { useSetRecoilState } from 'recoil';
import { postModalState } from '@/src/atoms/postModalAtom';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { app } from '@/src/firebase/clientApp';
import useSelectFile from '@/src/hooks/useSelectFile';
import { BiGame } from 'react-icons/bi';
import { getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage';
import PostModal from '../Modal/Post/PostModal';
import useCommunityData from '@/src/hooks/useCommunityData';
;

type AboutProps = {
    communityData: Community
};

const About: React.FC<AboutProps> = ({ communityData }) => {

    const auth = getAuth(app);
    const [user] = useAuthState(auth);
    const storage = getStorage(app);
    const firestore = getFirestore(app);
    const { communityStateValue } = useCommunityData();
    const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
    const selectedFileRef = useRef<HTMLInputElement>(null);
    const selectedBannerRef = useRef<HTMLInputElement>(null);

    // banner and com dp
    const [selectedBanner, setSelectedBanner] = useState<string>();
    const [selectedImage, setSelectedImage] = useState<string>();

    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingBanner, setUploadingBanner] = useState(false);

    const setCommunityStateValue = useSetRecoilState(communityState);
    const router = useRouter();
    const setPostModal = useSetRecoilState(postModalState);

    const openModal = () => {
        setPostModal((prev) => ({
            ...prev,
            open: true,
            view: 'post'
        }))
    }

    const onUpdateImage = async () => {
        if (!selectedImage) return;
        setUploadingImage(true);
        try {
            const imageRef = ref(storage, `communities/${communityData.id}/image`);
            await uploadString(imageRef, selectedImage, 'data_url');
            const downloadURL = await getDownloadURL(imageRef);
            await updateDoc(doc(firestore, 'communities', communityData.id), {
                imageURL: downloadURL,
            })

            // update recoil state
            setCommunityStateValue(prev => ({
                ...prev,
                currentCommunity: {
                    ...prev.currentCommunity,
                    imageURL: downloadURL,
                } as Community
            }))
        } catch (error) {
            console.log("onUpdateImage error: ", error);
        }
        setUploadingImage(false);
    };

    const onUpdateBanner = async () => {
        if (!selectedBanner) return;
        setUploadingBanner(true);
        try {
            const imageRef = ref(storage, `communities/${communityData.id}/banner`);
            await uploadString(imageRef, selectedBanner, 'data_url');
            const downloadURL = await getDownloadURL(imageRef);
            await updateDoc(doc(firestore, 'communities', communityData.id), {
                bannerURL: downloadURL,
            })

            // update recoil state
            setCommunityStateValue(prev => ({
                ...prev,
                currentCommunity: {
                    ...prev.currentCommunity,
                    bannerURL: downloadURL,
                } as Community
            }))
        } catch (error) {
            console.log("onUpdateBanner error: ", error);
        }
        setUploadingBanner(false);
    };

    const onSelectBanner = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        onSelectFile(event, setSelectedBanner);
    }

    const onSelectImage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        onSelectFile(event, setSelectedImage);
    }

    return (
        <>
            {user && <PostModal user={user} firestore={firestore} />}
            <Box position='sticky' top='54px'>
                <Flex
                    justify='space-between'
                    align='center'
                    bg='blue.400'
                    color='white'
                    p={3}
                    borderRadius='4px 4px 0px 0px'
                >
                    <Text fontSize='10pt' fontWeight={700}>
                        About
                    </Text>
                    <Icon
                        as={HiOutlineDotsHorizontal}
                        cursor='pointer'
                        _hover={{ boxShadow: 'lg', bg: 'blue.400' }}
                    />
                </Flex>
                <Flex
                    direction='column'
                    p={3}
                    bg='white'
                    borderRadius='0px 0px 4px 4px'
                >
                    <Stack>
                        <Flex width='100%' p={2} fontSize='10pt'>
                            <Flex direction='column' flexGrow={1}>
                                <Text fontSize='12pt' align='center'>{communityStateValue.currentCommunity?.numberOfMembers}</Text>
                                <Text fontWeight={600} align='center'>Members</Text>
                            </Flex>
                            <Flex direction='column' flexGrow={1}>
                                <Text fontSize='12pt' align='center' >1</Text>
                                <Flex direction='row' justify='center'>
                                    <Text fontWeight={600} align='center'>Online</Text>
                                    <Icon ml={-2} as={BsDot} fontSize={25} color='green' />
                                </Flex>

                            </Flex>
                        </Flex>
                        <Divider />
                        <Flex
                            align='center'
                            width='100%'
                            p={1}
                            fontWeight={500}
                            fontSize='10pt'
                        >
                            <Icon as={SlCalender} mr={2} />
                            {communityData.createdAt && (
                                <Text>
                                    Created{" "}
                                    {moment(
                                        new Date(communityData.createdAt.seconds * 1000)
                                    ).format("MMM DD, YYYY")}
                                </Text>
                            )}
                        </Flex>
                        <Button
                            mt={3}
                            height='30px'
                            onClick={openModal}
                        >
                            Create post
                        </Button>
                        {user?.uid === communityData.creatorId && (
                            <>
                                <Divider />
                                <Stack spacing={1} fontSize='10pt'>
                                    <Text fontWeight={600}>Admin arcs</Text>
                                    <Flex
                                        align='center' justify='space-between'
                                    >
                                        <Text
                                            color='blue.500'
                                            cursor='pointer'
                                            _hover={{ textDecoration: 'underline' }}
                                            onClick={() => {
                                                selectedFileRef.current?.click();
                                            }}
                                        >
                                            Change Image
                                        </Text>
                                        {communityData.imageURL || selectedImage ? (
                                            <Image
                                                border='1px solid gray'
                                                src={selectedImage || communityData.imageURL}
                                                borderRadius='full'
                                                boxSize='40px'
                                                alt='arc image'
                                            />
                                        ) : (
                                            <Icon
                                                as={BiGame}
                                                position='relative'
                                                bg="white"
                                                fontSize={54}
                                                borderRadius='50px'
                                            />
                                        )}
                                    </Flex>
                                    {selectedImage && (
                                        (uploadingImage ? (
                                            <Spinner />
                                        ) : (
                                            <Text
                                                cursor='pointer'
                                                onClick={onUpdateImage}
                                                ml='auto'
                                                mr={1}
                                                color='blue.600'
                                                width='fit-content'
                                                _hover={{ boxShadow: 'lg' }}
                                            >
                                                Save
                                            </Text>
                                        ))
                                    )}
                                    <input
                                        id="file-upload"
                                        type='file'
                                        accept='image/x-png,image/gif,image/jpeg'
                                        hidden
                                        ref={selectedFileRef}
                                        onChange={onSelectImage}
                                    />
                                    <Divider />
                                    <Flex align='center' justify='space-between'>
                                        <Text
                                            color='blue.500'
                                            cursor='pointer'
                                            _hover={{ textDecoration: 'underline' }}
                                            onClick={() => {
                                                selectedBannerRef?.current?.click();
                                            }}
                                        >
                                            Change banner
                                        </Text>
                                        {communityData.bannerURL || selectedBanner ? (
                                            <Image
                                                border='1px solid gray'
                                                src={selectedBanner || communityData.bannerURL}
                                                width='60px'
                                                height='30px'
                                                alt='arc image'
                                            />
                                        ) : (
                                            <Text color='gray.500'>No Banner</Text>
                                        )}
                                    </Flex>

                                    {selectedBanner && (
                                        (uploadingBanner ? (
                                            <Spinner />
                                        ) : (
                                            <Text
                                                cursor='pointer'
                                                onClick={onUpdateBanner}
                                                ml='auto'
                                                mr={1}
                                                color='blue.600'
                                                width='fit-content'
                                                _hover={{ boxShadow: 'lg' }}
                                            >
                                                Save
                                            </Text>
                                        ))
                                    )}
                                    <input
                                        id="file-upload"
                                        type='file'
                                        accept='image/x-png,image/gif,image/jpeg'
                                        hidden
                                        ref={selectedBannerRef}
                                        onChange={onSelectBanner}
                                    />
                                </Stack>
                            </>
                        )}
                    </Stack>
                </Flex>
                <Flex
                    direction='column'
                    width='100%'
                    height='30px'
                    mt={3}
                >
                    <Button
                        variant='outline'
                    >
                        Bulletin
                    </Button>
                </Flex>
            </Box>
        </>
    )
}
export default About;