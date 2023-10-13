import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Flex,
    Text,
    Input,
    Textarea,
    Button,
    Image,
    Icon,
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle
} from '@chakra-ui/react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';
import { storage } from '@/src/firebase/clientApp';
import { IoImageOutline } from "react-icons/io5"
import { RxVideo } from "react-icons/rx"
import { BsLink45Deg } from "react-icons/bs"
import { postModalState } from '@/src/atoms/postModalAtom';
import TextEditor from '../../Editor/TextEditor';
import dynamic from 'next/dynamic';
import { Post } from '@/src/atoms/postsAtom';
import { User, getAuth } from 'firebase/auth';
import { useRouter } from 'next/router';
import { Firestore, Timestamp, addDoc, arrayUnion, collection, getFirestore, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import useCommunityData from '@/src/hooks/useCommunityData';

type PostModalProps = {
    user: User;
    firestore: Firestore;
}

const PostModal: React.FC<PostModalProps> = ({ user, firestore }) => {

    const {communityStateValue} = useCommunityData();

    const router = useRouter();

    const [modalState, setModalState] = useRecoilState(postModalState);
    const setPostModal = useSetRecoilState(postModalState);

    const textarea = useRef(null);
    const editorRef = useRef<TinyMCEEditor | null>(null);
    const [uploadModal, setUploadModal] = useState(false);

    const [selectedFiles, setSelectedFiles] = useState<Array<string>>([]);
    const [loading, setLoading] = useState(false);
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [error, setError] = useState(false);

    const [textInputs, setTextInputs] = useState({
        title: "",
        body: "",
    })

    const selectedFileRef = useRef<HTMLInputElement>(null);

    const handleCreatePost = async () => {
        const { communityId } = router.query;
        console.log("selected Posts: ", selectedFiles);

        const postBody = editorRef.current?.getContent();

        const newPost: Post = {
            communityId: communityId as string,
            communityImageURL: communityStateValue.currentCommunity?.imageURL || '',
            creatorId: user?.uid,
            creatorDisplayName: user.email!.split('@')[0],
            title: textInputs.title,
            body: postBody,
            numberOfComments: 0,
            voteStatus: 0,
            createdAt: serverTimestamp() as Timestamp,
        }

        setLoading(true);
        try {
            const postDocRef = await addDoc(collection(firestore, 'posts'), newPost);

            console.log("selected files: ", selectedFiles);
            if (selectedFiles.length > 0) {
                selectedFiles.map(async (file, index) => {
                    const imageRef = ref(storage, `posts/${postDocRef.id}/${index}`);
                    await uploadString(imageRef, file, 'data_url');
                    const downloadURL = await getDownloadURL(imageRef);
                    await updateDoc(postDocRef, {
                        imageURL: arrayUnion(downloadURL)
                    }).then(() => {
                        setLoading(false);
                        handleClose();
                    })
                })
            }
            else {
                setLoading(false);
                handleClose();
            }
            router.push(`/arc/${communityId}`);
            // router.reload();

        } catch (error: any) {
            console.log("handleCreatePost error: ", error.message);
            setError(true);
            setLoading(false);
        }
        //console.log("POST: ", newPost);
    };

    const onTextChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const {
            target: { name, value },
        } = event;
        setTextInputs((prev) => ({
            ...prev,
            [name]: value,
        }))
    };

    // handle image/video upload logic
    const onSelectImage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const reader = new FileReader();
        if (event.target.files?.[0]) {
            let nImages = event.target.files.length;
            for (let i = 0; i < nImages; i++) {
                reader.readAsDataURL(event.target.files[i]);
            }
        }

        reader.onload = (readerEvent) => {
            if (readerEvent.target?.result) {
                console.log("selected files: ", selectedFiles);
                let _images: Array<string> = [...selectedFiles];
                _images.push(readerEvent.target.result as string);
                setSelectedFiles(_images);
            }
        }
    }

    const handleClose = () => {
        setSelectedFiles([]);
        setTextInputs(() => ({
            title: "",
            body: ""
        }))
        setModalState((prev) => ({
            ...prev,
            open: false,
        }))
    };

    return (
        <>
            {<Modal isOpen={modalState.open} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent maxW="56rem" w={{ sm: '46rem', md: '56rem' }} width='100%'>
                    <ModalHeader textAlign='center'>
                        {modalState.view === 'post' && 'Create a post'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display='flex'
                        flexDirection='column'
                        position='relative'
                        alignItems='center'
                        justifyContent='center'
                        pb={6}
                    >
                        <Flex
                            direction='column'
                            align='center'
                            justify='center'
                            width='100%'
                        >
                            <Input
                                required
                                name='title'
                                type='text'
                                width='100%'
                                value={textInputs.title}
                                placeholder='Title'
                                onChange={onTextChange}
                                fontSize='10pt'
                                fontWeight='bold'
                                _placeholder={{ colors: 'gray.500' }}
                                _hover={{
                                    bg: 'white',
                                    border: '1px solid',
                                    borderColor: 'blue.500'
                                }}
                                _focus={{
                                    outline: 'none',
                                    bg: 'white',
                                    border: '1px solid',
                                    borderColor: 'blue.500'
                                }}
                                bg='gray.50'
                                mb={4}
                            />
                            {/* <Textarea
                                required
                                name='body'
                                value={textInputs.body}
                                ref={textarea}
                                width={{ sm: '33rem', md: '40rem' }}
                                height='250px'
                                placeholder='Description (optional)'
                                onChange={onTextChange}
                                fontSize='10pt'
                                _placeholder={{ colors: 'gray.500' }}
                                _hover={{
                                    bg: 'white',
                                    border: '1px solid',
                                    borderColor: 'blue.500'
                                }}
                                _focus={{
                                    outline: 'none',
                                    bg: 'white',
                                    border: '1px solid',
                                    borderColor: 'blue.500'
                                }}
                                bg='gray.50'
                                mb={4}
                                maxH='300px'
                                resize='none'
                            >
                            </Textarea> */}
                            <Editor
                                apiKey='ut8z9ynns3q1lukvxhzkbc7hcfoerg0e2ur62haaz7jor4mc'
                                onInit={(evt, editor) => {
                                    editorRef.current = editor;
                                }}
                                init={{
                                    resize: false,
                                    branding: false,
                                    height: '350px',
                                    width: "100%",
                                    placeholder: "Text (optional)",
                                    menubar: false,
                                    plugins: "textcolor bold",
                                    toolbar: "forecolor | bold",
                                    textcolor_map: [
                                        "008000", "Green",
                                        "0000FF", "Blue",
                                        "808080", "Gray",
                                        "FF0000", "Red",
                                    ],
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; font-weight:100; }',
                                }}
                            />
                        </Flex>

                        <Flex
                            justify='flex-end'
                            marginLeft='auto'
                            width='100%'
                            marginRight={{ sm: '0rem', md: '1.5rem' }}
                            mt={2}
                        >
                            <Icon
                                as={BsLink45Deg}
                                fontSize={24}
                                mr={4}
                                color='gray.500'
                                cursor='pointer'
                                marginTop='0.5rem'
                                _hover={{ color: 'gray.700' }}
                            />
                            <Icon
                                as={RxVideo}
                                fontSize={24}
                                mr={4}
                                color='gray.500'
                                cursor='pointer'
                                marginTop='0.5rem'
                                _hover={{ color: 'gray.700' }}
                            />
                            <Icon
                                as={IoImageOutline}
                                fontSize={24}
                                mr={4}
                                color='gray.500'
                                cursor='pointer'
                                marginTop='0.5rem'
                                _hover={{ color: 'gray.700' }}
                                onClick={() => selectedFileRef.current?.click()}
                            />
                            <input
                                ref={selectedFileRef}
                                type="file"
                                hidden
                                onChange={onSelectImage}
                            />
                            <Button
                                isLoading={loading}
                                float='right'
                                isDisabled={textInputs.title === ""}
                                onClick={handleCreatePost}
                            >
                                Post
                            </Button>
                        </Flex>
                        <Flex
                            justify='flex-start'
                            marginRight='auto'
                        >
                            {
                                selectedFiles.map((image, index) => (
                                    <Image
                                        alt=''
                                        key={image}
                                        src={image}
                                        maxWidth='40px'
                                        maxHeight='40px'
                                        margin='1px 6px 1px 0px'
                                        opacity={0.9}
                                        _hover={{ opacity: '50%', border: '1px dotted red' }}
                                    />
                                ))
                            }
                        </Flex>
                        {error && (
                            <Alert status='error' mt={2}>
                                <AlertIcon />
                                <Text mr={2} fontSize={14}>Error creating post</Text>
                            </Alert>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>}
        </>
    )
}

export default PostModal;