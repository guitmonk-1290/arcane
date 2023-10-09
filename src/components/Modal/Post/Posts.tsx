import { Community } from '@/src/atoms/communitiesAtom';
import { Firestore, collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';
import { app } from "@/src/firebase/clientApp"
import React, { useEffect, useState } from 'react';
import usePosts from '@/src/hooks/usePosts';
import { Post, postState } from '@/src/atoms/postsAtom';
import PostItem from './PostItem';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import PostLoader from './PostLoader';

type PostsProps = {
    communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {

    const firestore = getFirestore(app);
    const auth = getAuth(app);
    const [user] = useAuthState(auth);

    const [loading, setLoading] = useState(false);
    const {
        postStateValue,
        setPostStateValue,
        onVote,
        onDeletePost,
        onSelectPost
    } = usePosts();

    const getPosts = async () => {
        setLoading(true);
        try {
            const postsQuery = query(collection(firestore, 'posts'), where('communityId', '==', communityData.id), orderBy('createdAt', "desc"));
            const postDocs = await getDocs(postsQuery);

            const posts = postDocs.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setPostStateValue((prev) => ({
                ...prev,
                posts: posts as Post[],
            }))

        } catch (error: any) {
            console.log('getPosts error: ', error.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        getPosts();
    }, [communityData])

    return (
        <>
            {

            }

            {loading ? (
                <PostLoader />
            ) : (
                <>
                    {postStateValue.posts.length === 0 &&
                        <Box
                            padding="10px 10px 10px 10px"
                            boxShadow="lg"
                            bg="gray.100"
                            borderRadius={4}
                            position='relative'
                        >
                            <Flex
                                alignItems='center'
                                justifyContent='center'
                            >
                                <Text
                                    align='center'
                                    marginTop='auto'
                                    fontSize={14}
                                    color='gray.600'
                                >
                                    No Posts yet. Be the first to say something...
                                </Text>
                            </Flex>
                        </Box>}
                    <Stack>
                        {postStateValue.posts.map(item => (
                            <PostItem
                                key={item.id}
                                post={item}
                                userIsCreator={user?.uid === item.creatorId}
                                userVoteValue={
                                    postStateValue.postVotes.find((vote) => vote.postId === item.id)
                                    ?.voteValue
                                }
                                onVote={onVote}
                                onDeletePost={onDeletePost}
                                onSelectPost={onSelectPost}
                            />
                        ))}
                    </Stack>
                </>
            )}
        </>
    )
}
export default Posts;