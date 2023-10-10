import React, {useEffect, useState} from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Community, CommunitySnippet, communityState } from '../atoms/communitiesAtom';
import { useAuthState } from 'react-firebase-hooks/auth';
import {app} from "../firebase/clientApp"
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, getFirestore, increment, writeBatch } from 'firebase/firestore';
import { write } from 'fs';
import { authModalState } from '../atoms/authModalAtom';
import { useRouter } from 'next/router';

const useCommunityData = () => {
    
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState);
    const setAuthModalState = useSetRecoilState(authModalState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onJoinOrLeaveCommunity = (
        communityData: Community,
        isJoined: boolean
    ) => {
        if (!user) {
            setAuthModalState({ open: true, view: "login" });
            return;       
        }

        if (isJoined) {
            leaveCommunity(communityData.id);
            return;
        }
        joinCommunity(communityData);
    }

    const getMySnippets = async () => {
        setLoading(true);
        try {
            const snippetDocs = await getDocs(
                collection(firestore, `users/${user?.uid}/communitySnippets`)
            );
            
            const snippets = snippetDocs.docs.map((doc) => ({...doc.data()}));
            setCommunityStateValue(prev => ({
                ...prev,
                mySnippets: snippets as CommunitySnippet[],
                fetchedSnippets: true
            }))
            console.log("community state value: ", communityStateValue);
        } catch (error: any) {
            console.log('getMySnippets error', error);
            setError(error.message);
        }
        setLoading(false);
    }

    const joinCommunity = async (communityData: Community) => {
        setLoading(true);
        try {
            const batch = writeBatch(firestore);
            const newSnippet: CommunitySnippet = {
                communityId: communityData.id,
                imageURL: communityData.imageURL || "",
                isModerator: user?.uid === communityData.creatorId,
            };

            batch.set(doc(firestore, `users/${user?.uid}/communitySnippets`, communityData.id), newSnippet);
            
            batch.update(doc(firestore, 'communities', communityData.id), {
                numberOfMembers : increment(1),
            })

            await batch.commit();

            let currentMembers = communityStateValue.currentCommunity?.numberOfMembers;
            let updatedCommunity = { ...communityStateValue.currentCommunity }
            updatedCommunity.numberOfMembers = currentMembers! + 1;

            // update recoil state
            setCommunityStateValue(prev => ({
                ...prev,
                mySnippets: [...prev.mySnippets, newSnippet],
                currentCommunity: updatedCommunity as Community
            }))

        } catch (error: any) {
            console.log("joinCommunity error: ", error);
            setError(error.message);
        }

        setLoading(false);
    };
    
    const leaveCommunity = async (communityId: string) => {
        setLoading(true);
        try {
            const batch = writeBatch(firestore);

            batch.delete(doc(firestore, `users/${user?.uid}/communitySnippets`, communityId))

            batch.update(doc(firestore, 'communities', communityId), {
                numberOfMembers: increment(-1)
            })

            await batch.commit();

            let currentMembers = communityStateValue.currentCommunity?.numberOfMembers;
            let updatedCommunity = { ...communityStateValue.currentCommunity }
            updatedCommunity.numberOfMembers = currentMembers! - 1;
            
            setCommunityStateValue(prev => ({
                ...prev,
                mySnippets: prev.mySnippets.filter(item => item.communityId !== communityId),
                currentCommunity: updatedCommunity as Community,
            }))
            
        } catch (error: any) {
            console.log("leaveCommunity error: ", error);
            setError(error.message);
        }
        setLoading(false);
    };

    const getCommunityData = async (communityId: string) => {
        try {
            const communityDocRef = doc(firestore, 'communities', communityId);
            const communityDoc = await getDoc(communityDocRef);

            setCommunityStateValue(prev => ({
                ...prev,
                currentCommunity: { 
                    id: communityDoc.id, ...communityDoc.data() 
                } as Community
            }))
        } catch (error) {
            console.log("getCommunityData error: ", error);
        }
    }

    useEffect(() => {
        if (!user) {
            setCommunityStateValue((prev) => ({
                ...prev,
                mySnippets: [],
                fetchedSnippets: false
            }))
            return;
        }
        console.log("getting snippets...");
        // console.log("USER: ", user);
        getMySnippets();
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user])

    useEffect(() => {
        const { communityId } = router.query;

        if (communityId && !communityStateValue.currentCommunity) {
            getCommunityData(communityId as string);
        }
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.query, communityStateValue.currentCommunity])

    return {
        // returns data and functions accessible by other components
        communityStateValue,
        onJoinOrLeaveCommunity,
        loading
    }
}
export default useCommunityData;