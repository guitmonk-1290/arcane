import { Post, postState } from '@/src/atoms/postsAtom';
import { Box, Flex, SkeletonCircle, SkeletonText, Stack, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import CommentInput from './CommentInput';
import { Timestamp, collection, doc, getDocs, getFirestore, increment, orderBy, query, serverTimestamp, where, writeBatch } from 'firebase/firestore';
import { app } from '@/src/firebase/clientApp';
import { useSetRecoilState } from 'recoil';
import CommentItem from './CommentItem';

type CommentsProps = {
    user: User;
    selectedPost: Post | null;
    communityId: string;
};

export type Comment = {
    id: string;
    creatorId: string;
    creatorDisplayName: string;
    communityId: string;
    postId: string;
    postTitle: string;
    text: string;
    createdAt: Timestamp;
}

const Comments: React.FC<CommentsProps> = ({
    user,
    selectedPost,
    communityId
}) => {

    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState("");
    const setPostState = useSetRecoilState(postState);

    const firestore = getFirestore(app);

    const onCreateComment = async (commentText: string) => {
        setCreateLoading(true);
        try {
            const batch = writeBatch(firestore);

            const commentDocRef = doc(collection(firestore, 'comments'));

            const newComment: Comment = {
                id: commentDocRef.id,
                creatorId: user?.uid,
                creatorDisplayName: user.email!.split('@')[0],
                communityId,
                postId: selectedPost?.id!,
                postTitle: selectedPost?.title!,
                text: commentText,
                createdAt: serverTimestamp() as Timestamp
            }

            batch.set(commentDocRef, newComment);

            newComment.createdAt = {
                seconds: Date.now() / 1000
            } as Timestamp

            // update noOfComments field
            const postDocRef = doc(firestore, 'posts', selectedPost?.id!);
            batch.update(postDocRef, {
                numberOfComments: increment(1),
            })

            await batch.commit();

            // update client-recoil state
            setCommentText("");
            setComments(prev => [newComment, ...prev]);
            setPostState(prev => ({
                ...prev,
                selectedPost: {
                    ...prev.selectedPost,
                    numberOfComments: prev.selectedPost?.numberOfComments! + 1
                } as Post
            }))

        } catch (error) {
            console.log("onCreateComment error: ", error);
        }
        setCreateLoading(false);
    };

    const onDeleteComment = async (comment: Comment) => {
        setLoadingDelete(comment.id as string);
        try {
            if (!comment.id) throw "Comment has no ID";
            const batch = writeBatch(firestore);
            const commentDocRef = doc(firestore, 'comments', comment.id);
            batch.delete(commentDocRef);

            batch.update(
                doc(firestore, 'posts', comment.postId), {
                    numberOfComments: increment(-1),
                }
            )

            await batch.commit();

            setPostState((prev) => ({
                ...prev,
                selectedPost: {
                    ...prev.selectedPost,
                    numberOfComments: prev.selectedPost?.numberOfComments! - 1,
                } as Post,  
            }))

            setComments((prev) => prev.filter((item) => item.id !== comment.id));

        } catch (error: any) {
            console.log("onDeleteComment error: ", error);
        }
        setLoadingDelete("");
    };

    const getPostComments = async () => {
        setFetchLoading(true);
        try {
            const commentsQuery = query(
                collection(firestore, 'comments'),
                where('postId', '==', selectedPost?.id),
                orderBy("createdAt", "desc")
            );
            const commentDocs = await getDocs(commentsQuery);
            const comments = commentDocs.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            console.log("comments: ", comments);
            setComments(comments as Comment[]);

        } catch (error) {
            console.log('getPostComments error: ', error);
        }
        setFetchLoading(false);
    };

    useEffect(() => {
        if (!selectedPost) return;
        getPostComments();
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedPost])

    return (
        <Box
            bg='white'
            borderRadius='0px 0px 4px 4px'
            p={2}
        >
            <Flex
                direction='column'
                pl={10}
                pr={4}
                mb={6}
                fontSize='10pt'
                width='100%'
            >
                <CommentInput
                    comment={commentText}
                    setCommentText={setCommentText}
                    user={user}
                    createLoading={createLoading}
                    onCreateComment={onCreateComment}
                />
            </Flex>
            <Stack spacing={6} p={2}>
                {fetchLoading ? (
                    <>
                        {[0, 1, 2].map(item => (
                            <Box key={item} padding='6' bg='white'>
                                <SkeletonCircle size='10' />
                                <SkeletonText mt='4' noOfLines={2} spacing='4' />
                            </Box>
                        ))}
                    </>
                ) : (
                    <>
                        {!!comments.length ? (
                            <>
                                {comments.map(comment => (
                                    <CommentItem
                                        key={comment.id}
                                        comment={comment}
                                        onDeleteComment={onDeleteComment}
                                        loadingDelete={loadingDelete === (comment.id as string)}
                                        userId={user?.uid}
                                    />
                                ))}
                            </>

                        ) : (
                            <Flex
                                direction='column'
                                justify='center'
                                align='center'
                                borderTop='1px solid'
                                borderColor='gray.100'
                                p={20}
                            >
                                <Text fontWeight={700} opacity={0.3}>
                                    No Comments yet...
                                </Text>
                            </Flex>
                        )}
                    </>
                )}
            </Stack>
        </Box>
    )
}
export default Comments;