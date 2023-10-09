import { Inter } from 'next/font/google'
import PageContent from '@/src/components/Layout/PageContent'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import { app } from '@/src/firebase/clientApp'
import { useEffect, useState } from 'react'
import { collection, getDocs, getFirestore, limit, orderBy, query, where } from 'firebase/firestore'
import usePosts from '@/src/hooks/usePosts'
import { Post, PostVote } from '@/src/atoms/postsAtom'
import PostLoader from '@/src/components/Modal/Post/PostLoader'
import { Box, Flex, Stack, Image, Text } from '@chakra-ui/react'
import PostItem from '@/src/components/Modal/Post/PostItem'
import CreatePostLink from '@/src/components/Community/CreatePostLink'
import { useRecoilValue } from 'recoil'
import { communityState } from '@/src/atoms/communitiesAtom'
import useCommunityData from '@/src/hooks/useCommunityData'
import Recommendations from '@/src/components/Community/Recommendations'
import HomeCreate from '@/src/components/Community/HomeCreate'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const auth = getAuth(app);
  const [user, loadingUser] = useAuthState(auth);
  const firestore = getFirestore(app);
  const [loading, setLoading] = useState(false);
  const [topArcsLoading, setTopArcsLoading] = useState(false);
  const {communityStateValue} = useCommunityData();
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onDeletePost,
    onSelectPost 
  } = usePosts();

  const buildUserHomeFeed = async () => {
    setLoading(true);
    try {
      if (communityStateValue.mySnippets.length) {
        const myCommunityIds = communityStateValue.mySnippets.map(snippet => snippet.communityId);

        const postQuery = query(collection(firestore, 'posts'), where('communityId', 'in', myCommunityIds), orderBy('voteStatus', 'desc'), limit(10));

        const postDocs = await getDocs(postQuery);
        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setPostStateValue(prev => ({
          ...prev,
          posts: posts as Post[]
        }))

      } else {
        buildNoUserHomeFeed();
      }
    } catch (error) {
      console.log("buildUserHomeFeed error: ", error);
    }
    setLoading(false);
  }

  const buildNoUserHomeFeed = async () => {
    setLoading(true);
    try {
      // pagination
      const postQuery = query(collection(firestore, 'posts'), orderBy('voteStatus', 'desc'), limit(10));

      const postDocs = await getDocs(postQuery);

      const posts = postDocs.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      setPostStateValue(prev => ({
        ...prev,
        posts: posts as Post[],
      }))

    } catch (error) {
      console.log('buildNoUserHomeFeed error: ', error);
    }
    setLoading(false);
  }

  const getUserPostVotes = async () => {
    try {
      const postIds = postStateValue.posts.map(post => post.id);
      const postVotesQuery = query(collection(firestore, `users/${user?.uid}/postVotes`), where('postId', 'in', postIds));
      const postVotesDocs = await getDocs(postVotesQuery);
      const postVotes = postVotesDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setPostStateValue(prev => ({
        ...prev,
        postVotes: postVotes as PostVote[]
      }))
      
    } catch (error) {
      console.log('getUserPostVotes error: ', error);
    }
  };

  const getTopArcs = async () => {
    setTopArcsLoading(true);
    try {
      const topArcsQuery = query(collection(firestore, 'communities'), )
    } catch (error) {
      console.log("getTopArcs() error: ", error);
    }
    setTopArcsLoading(false);
  }

  useEffect(() => {
    if (communityStateValue.fetchedSnippets) buildUserHomeFeed();
  }, [communityStateValue.fetchedSnippets])

  useEffect(() => {
    if (!user && !loadingUser) buildNoUserHomeFeed();
  }, [user, loadingUser])

  useEffect(() => {
    if (user && postStateValue.posts.length) getUserPostVotes();

    // cleanup function
    return () => {
      setPostStateValue(prev => ({
        ...prev,
        postVotes: []
      }))
    }
  }, [user, postStateValue.posts])

  return (
    <PageContent>
      <>
        <CreatePostLink />
        {
          loading ? (
            <PostLoader />
          ) : (
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
                  homePage
                />
              ))}
            </Stack>
          )
        }
      </>
      <>
        <Recommendations />
        <HomeCreate />
      </>
    </PageContent>
  )
}