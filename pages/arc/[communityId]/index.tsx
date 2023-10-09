import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import React, { useEffect } from 'react';
import NotFound from "../../../src/components/Community/NotFound"
import { Community, communityState } from '@/src/atoms/communitiesAtom';
import { app } from '@/src/firebase/clientApp';
import safeJsonStringify from "safe-json-stringify"
import Header from '@/src/components/Community/Header';
import PageContent from '@/src/components/Layout/PageContent';
import CreatePostLink from '@/src/components/Community/CreatePostLink';
import Posts from '@/src/components/Modal/Post/Posts';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import About from '@/src/components/Community/About';
import { BiAbacus } from "react-icons/bi"
import useCommunityData from '@/src/hooks/useCommunityData';
import { Flex } from '@chakra-ui/react';


type CommunityPageProps = {
    communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
    const setCommunityStateValue = useSetRecoilState(communityState);
    const communityStateValue = useRecoilValue(communityState);
    console.log('community state value: ', communityStateValue);

    if (!communityData) {
        return <NotFound />
    }

    useEffect(() => {
        setCommunityStateValue((prev) => ({
            ...prev,
            currentCommunity: communityData
        }))
    }, [communityData])

    return (
        <>
            <Header communityData={communityData} />
            <Flex
                
            >
                <PageContent>
                    <>
                        <CreatePostLink />
                        <Posts communityData={communityData} />
                    </>
                    <>
                        <About communityData={communityData} />
                    </>
                </PageContent>
            </Flex>
        </>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    try {
        const firestore = getFirestore(app);
        const communityDocRef = doc(firestore, 'communities', context.query.communityId as string);
        const communityDoc = await getDoc(communityDocRef);

        return {
            props: {
                communityData: communityDoc.exists() ? JSON.parse(safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }))
                    : ""
            }
        }
    } catch (error) {
        console.log('getServerSideProps error', error);
    }
}

export default CommunityPage;