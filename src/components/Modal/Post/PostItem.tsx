import React, { useState, useRef, MutableRefObject, useEffect } from 'react';
import moment from "moment"
import { motion } from "framer-motion"
import parse from "html-react-parser"
import usePosts from '@/src/hooks/usePosts';
import { Post } from '@/src/atoms/postsAtom';
import { AiOutlineDelete } from "react-icons/ai"
import { BsChat, BsDot } from "react-icons/bs"
import { FaReddit } from "react-icons/fa"
import {
    IoArrowDownCircle,
    IoArrowDownCircleSharp,
    IoArrowRedoOutline,
    IoArrowUpCircleOutline,
    IoArrowDownCircleOutline,
    IoArrowUpCircleSharp,
    IoBookmarkOutline
} from "react-icons/io5"
import { Flex, Icon, Stack, Text, Skeleton, Spinner, Alert, AlertIcon, Image } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { BiGame } from 'react-icons/bi';
import Link from 'next/link';

type PostItemProps = {
    post: Post;
    userIsCreator: boolean;
    userVoteValue?: number;
    onVote: (
        event: React.MouseEvent<SVGElement, MouseEvent>,
        post: Post,
        vote: number,
        communityId: string
    ) => void;
    onDeletePost: (post: Post) => Promise<boolean>;
    onSelectPost?: (post: Post) => void;
    homePage?: boolean;
};

const PostItem: React.FC<PostItemProps> = ({
    post,
    userIsCreator,
    userVoteValue,
    onVote,
    onDeletePost,
    onSelectPost,
    homePage
}) => {

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    const [width, setWidth] = useState(0);
    const [error, setError] = useState('');
    const [loadingImage, setLoadingImage] = useState(true);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const router = useRouter();
    const singlePostPage = !onSelectPost;

    const carousel = useRef<any>();

    const handleDelete = async (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation();
        setLoadingDelete(true);
        try {
            const success = await onDeletePost(post);
            if (!success) {
                throw new Error("Failed to delete post");
            }
            console.log('post deleted...')

            if (singlePostPage) {
                router.push(`/arc/${post.communityId}`)
            }
        } catch (error: any) {
            setError(error.message);
        }
        setLoadingDelete(false);
    }

    useEffect(() => {
        console.log('post: ', post);
        if (carousel) {
            setWidth(carousel.current?.scrollWidth - carousel.current?.offsetWidth);
        }
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [])

    return (
        <Flex
            border='1px solid'
            bg='white'
            borderColor={singlePostPage ? 'white' : 'gray.300'}
            borderRadius={4}
            _hover={{ borderColor: singlePostPage ? 'none' : 'gray.500' }}
            cursor={singlePostPage ? 'unset' : 'pointer'}
            onClick={() => onSelectPost && onSelectPost(post)}
        >
            <Flex
                direction='column'
                align='center'
                bg={singlePostPage ? 'none' : 'gray.100'}
                p={2.5}
                width='10%'
                borderRadius={singlePostPage ? '0' : '3px 0px 0px 3px'}
            >
                <Icon
                    as={
                        userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
                    }
                    color={
                        userVoteValue === 1 ?
                            'blue.600' :
                            'blue.800'
                    }
                    fontSize={28}
                    onClick={(event) => onVote(event, post, 1, post.communityId)}
                    cursor='pointer'
                />
                <Text fontSize='9pt'>{post.voteStatus}</Text>
                <Icon
                    as={
                        userVoteValue === -1 ? IoArrowDownCircleSharp : IoArrowDownCircleOutline
                    }
                    color={
                        userVoteValue === -1 ?
                            'gray.800' :
                            'gray.600'
                    }
                    fontSize={28}
                    onClick={(event) => onVote(event, post, -1, post.communityId)}
                    cursor='pointer'
                />
            </Flex>
            <Flex
                direction='column'
                width='90%'
            >
                {error && (
                    <Alert status='error'>
                        <AlertIcon />
                        <Text mr={2} fontSize={14}>{error}</Text>
                    </Alert>
                )}
                <Stack spacing={1} p="4px" fontFamily='helvetica' >
                    <Flex p='8px' bgColor='gray.100'
                            borderRadius='5px'>
                        <Stack
                            direction='row'
                            spacing={0.6}
                            align='center'
                            fontSize='9pt'
                            
                        >
                            <Flex
                                direction='row'
                                mt={1}
                                flexWrap='wrap'
                            >
                                <Flex direction='row' mt='-4px'>
                                    {
                                        homePage && (
                                            <>
                                                {
                                                    post.communityImageURL ? (
                                                        <Image
                                                            alt='Community Image'
                                                            src={post.communityImageURL}
                                                            borderRadius='full'
                                                            boxSize='18px'
                                                            mr={2}
                                                        />
                                                    ) : (
                                                        <Icon
                                                            as={BiGame}
                                                            fontSize='18pt'
                                                            mr={1}
                                                            mt='-1px'
                                                            color='blue.500'
                                                        />
                                                    )
                                                }
                                                <Link href={`arc/${post.communityId}`}>
                                                    <Text
                                                        mr={4}
                                                        fontWeight={600}
                                                        fontSize='10pt'
                                                        _hover={{ textDecoration: "underline" }}
                                                        onClick={event => event.stopPropagation()}
                                                    >{`arc/${post.communityId}`}</Text>
                                                </Link>
                                            </>
                                        )
                                    }
                                </Flex>

                                <Flex>
                                    <Text>Posted by</Text>
                                    <Text ml={1} color='blue.400' fontWeight='bold'>
                                        {post.creatorDisplayName}
                                    </Text>
                                    <Text ml={2}>
                                        {moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
                                    </Text>
                                </Flex>

                            </Flex>
                        </Stack>
                    </Flex>

                    <Text fontSize='12pt' fontWeight={600}>
                        {post.title}
                    </Text>
                    {post.imageURL &&
                        <Flex
                            width='100%'
                            maxHeight='20rem'
                        >
                            <motion.div ref={carousel} className='carousel'>
                                <motion.div
                                    drag='x'
                                    className='inner-carousel'
                                    dragConstraints={{ right: 0, left: -width }}
                                >
                                    {post.imageURL.map((img, index) => (
                                        <motion.div className='item'
                                            key={post.id}
                                        >
                                            {loadingImage && (
                                                <Skeleton height='200px' width='100%' borderRadius={4} />
                                            )}
                                            <Image
                                                key={index}
                                                src={img}
                                                alt=''
                                                hidden={loadingImage}
                                                onLoad={() => setLoadingImage(false)} />
                                        </motion.div>
                                    ))}

                                </motion.div>
                            </motion.div>
                        </Flex>}
                    {post.body && <Text mt={1} fontSize='10pt'>{parse(post.body)}</Text>}
                </Stack>
                <Flex ml={1} mb={0.5} color='gray.500'>
                    <Flex
                        align='center'
                        p='8px 10px'
                        borderRadius={4}
                        _hover={{ bg: 'gray.200' }}
                        cursor='pointer'
                    >
                        <Icon as={BsChat} mr={2} />
                        <Text fontSize='9pt'>{post.numberOfComments}</Text>
                    </Flex>
                    <Flex
                        align='center'
                        p='8px 10px'
                        borderRadius={4}
                        _hover={{ bg: 'gray.200' }}
                        cursor='pointer'
                    >
                        <Icon as={IoArrowRedoOutline} mr={2} />
                        <Text fontSize='9pt'>Share</Text>
                    </Flex>
                    <Flex
                        align='center'
                        p='8px 10px'
                        borderRadius={4}
                        _hover={{ bg: 'gray.200' }}
                        cursor='pointer'
                    >
                        <Icon as={IoBookmarkOutline} mr={2} />
                        <Text fontSize='9pt'>Save</Text>
                    </Flex>
                    {userIsCreator && (
                        <Flex
                            align='center'
                            p='8px 10px'
                            borderRadius={4}
                            _hover={{ bg: 'gray.200', color: 'red' }}
                            cursor='pointer'
                            onClick={(event) => handleDelete(event)}
                        >
                            {loadingDelete ? (
                                <Spinner size='sm' ml={2} />
                            ) : (
                                <>
                                    <Icon as={AiOutlineDelete} mr={2} />
                                    <Text fontSize='9pt'>
                                        Delete
                                    </Text>
                                </>
                            )}
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </Flex>
    )
}
export default PostItem;