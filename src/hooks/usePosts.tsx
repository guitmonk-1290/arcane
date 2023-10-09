import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Post, PostVote, postState } from '../atoms/postsAtom';
import { deleteObject, ref } from 'firebase/storage';
import { app, storage } from '../firebase/clientApp';
import { collection, deleteDoc, doc, getDocs, getFirestore, query, where, writeBatch } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { communityState } from '../atoms/communitiesAtom';
import { BsArrowReturnLeft } from 'react-icons/bs';
import { useRouter } from 'next/router';

const usePosts = () => {

    const router = useRouter();

    const [postStateValue, setPostStateValue] = useRecoilState(postState);
    const currentCommunity = useRecoilValue(communityState).currentCommunity;

    const firestore = getFirestore(app);
    const auth = getAuth(app);
    const [user] = useAuthState(auth);

    const onVote = async (
        event:React.MouseEvent<SVGElement, MouseEvent>, 
        post: Post, 
        vote: number, 
        communityId: string ) => {
            
        // check for user?
        
        event.stopPropagation();
        try {
            const { voteStatus } = post;
            const existingVote = postStateValue.postVotes.find(vote => vote.postId === post.id)

            const batch = writeBatch(firestore);
            const updatedPost = { ...post };
            const updatedPosts = [ ...postStateValue.posts ];
            let updatedPostVotes = [ ...postStateValue.postVotes ];
            let voteChange = vote;

            if (!existingVote) {
                const postVoteRef = doc(
                    collection(firestore, "users", `${user?.uid}/postVotes`)
                );

                const newVote: PostVote = {
                    id: postVoteRef.id,
                    postId: post.id!,
                    communityId,
                    voteValue: vote
                }

                batch.set(postVoteRef, newVote);

                // update values
                updatedPost.voteStatus = voteStatus + vote;
                updatedPostVotes = [...updatedPostVotes, newVote];
            }
            else {
                const postVoteRef = doc(firestore, 'users', `${user?.uid}/postVotes/${existingVote.id}`);

                if (existingVote.voteValue === vote) {
                    // go in opposite direction
                    updatedPost.voteStatus = voteStatus - vote;
                    updatedPostVotes = updatedPostVotes.filter(
                        vote => vote.id !== existingVote.id
                    );

                    batch.delete(postVoteRef);

                    voteChange *= -1;
                }
                else {
                    updatedPost.voteStatus = voteStatus + 2 * vote;
                    
                    const voteIdx = postStateValue.postVotes.findIndex(
                        vote => vote.id === existingVote.id
                    );
                    
                    updatedPostVotes[voteIdx] = {
                        ...existingVote,
                        voteValue: vote
                    }

                    batch.update(postVoteRef, {
                        voteValue: vote
                    })

                    voteChange = 2 * vote;
                }   
            }

            const postRef = doc(firestore, 'posts', post.id!);
            batch.update(postRef, { voteStatus: voteStatus + voteChange });

            await batch.commit();

            const postIdx = postStateValue.posts.findIndex(
                (item) => item.id === post.id
            );
            updatedPosts[postIdx] = updatedPost;

            // update state
            setPostStateValue(prev => ({
                ...prev,
                posts: updatedPosts,
                postVotes: updatedPostVotes
            }))

            if (postStateValue.selectedPost) {
                setPostStateValue((prev) => ({
                    ...prev,
                    selectedPost: updatedPost,
                }))
            }

        } catch (error) {
            console.log('onVote error: ', error);
        }
    };

    const onSelectPost = (post: Post) => {
        setPostStateValue(prev => ({
            ...prev,
            selectedPost: post,
        }));

        router.push(`/arc/${post.communityId}/comments/${post.id}`)
    };

    const onDeletePost = async (post: Post): Promise<boolean> => {
        try {
            console.log("deleting post...");
            // delete images, if any
            if (post.imageURL) {
                post.imageURL.map(async (file, index) => {
                    const imageRef = ref(storage, `posts/${post.id}/${index}`);
                    await deleteObject(imageRef).then(() => console.log('image deleted...'));
                })
            }

            // delete post object
            const postDocRef = doc(firestore, 'posts', post.id!);
            await deleteDoc(postDocRef).then(() => console.log('doc deleted!'));

            // update recoil state
            setPostStateValue(prev => ({
                ...prev,
                posts: prev.posts.filter(item => item.id !== post.id)
            }))
            
            return true;

        } catch (error: any) {
            return false;
        }
    };

    const getCommunityPostVote = async (communityId: string) => {
        const postVotesQuery = query(collection(firestore, "users", `${user?.uid}/postVotes`), where("communityId", "==", communityId));

        const postVoteDocs = await getDocs(postVotesQuery);
        const postVotes = postVoteDocs.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
        setPostStateValue((prev) => ({
            ...prev,
            postVotes: postVotes as PostVote[]
        }))
    }

    useEffect(() => {
        if (!user || !currentCommunity?.id) {
            return;
        }
        getCommunityPostVote(currentCommunity?.id);
    }, [user, currentCommunity])

    return {
        postStateValue,
        setPostStateValue,
        onVote,
        onSelectPost,
        onDeletePost
    }
}
export default usePosts;