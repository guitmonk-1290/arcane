import { Community } from '@/src/atoms/communitiesAtom';
import { app } from '@/src/firebase/clientApp';
import useCommunityData from '@/src/hooks/useCommunityData';
import { Flex, Spinner, Text, Image, Icon, Box, Button } from '@chakra-ui/react';
import { collection, getDocs, getFirestore, limit, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { BiGame } from 'react-icons/bi';

const Recommendations: React.FC = () => {

    const firestore = getFirestore(app);

    const [communities, setCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(false);
    const { communityStateValue, onJoinOrLeaveCommunity } = useCommunityData();

    const getCommunityRecommendations = async () => {
        setLoading(true);
        try {
            const Communitiesquery = query(collection(firestore, 'communities'), orderBy('numberOfMembers', 'desc'), limit(5));
            const CommunityDocs = await getDocs(Communitiesquery);
            const communities = CommunityDocs.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setCommunities(communities as Community[]);

        } catch (error) {
            console.log("getCommunityRecommendations() error: ", error);
        }
        setLoading(false);
    }

    useEffect(() => {
        getCommunityRecommendations();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps 
    [])

    return (
        <Flex
            position='sticky'
            direction='column'
            borderRadius={4}
        >
            <Flex
                align='flex-end'
                color='white'
                p='6px 10px'
                height='70px'
                fontWeight={700}
                borderRadius='10px 10px 0px 0px'
                bgImage="url(/images/topComBan.jpeg)"
                backgroundSize='cover'
                bgGradient="linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.65)), url('/images/topComBan.jpeg')"
            >
                Top Arcs {loading && <Flex ml={2}><Spinner /></Flex>}
            </Flex>
            <Flex
                justify='space-between'
                bgColor='white'
                direction='column'
            >
                {
                    !loading && (
                        <>
                            {communities.map((item, index) => {
                                const isJoined = !!communityStateValue.mySnippets.find(
                                    (snippet) => snippet.communityId === item.id
                                )
                                return (
                                    <Link key={item.id} href={`/arc/${item.id}`}>
                                        <Flex
                                            position='relative'
                                            p='10px 12px'
                                            align='center'
                                            fontSize='10pt'
                                            borderBottom='1px solid'
                                            borderColor='gray.200'
                                            _hover={{ bgColor: 'gray.100'}}
                                        >
                                            <Flex
                                                width='80%'
                                                align='center'
                                            >
                                                <Flex
                                                    width='15%'

                                                >
                                                    <Text>#{index + 1}</Text>
                                                </Flex>
                                                <Flex
                                                    width='80%'
                                                >
                                                    {
                                                        item.imageURL ? (
                                                            <Image
                                                                src={item.imageURL}
                                                                borderRadius='full'
                                                                boxSize='28px'
                                                                mr={2}
                                                                mt='auto'
                                                                mb='auto'
                                                            />
                                                        ) : (
                                                            <Icon
                                                                as={BiGame}
                                                                boxSize='28px'
                                                                color='blue.400'
                                                                borderRadius='full'
                                                                mr={2}
                                                                mt='auto'
                                                                mb='auto'
                                                            />
                                                        )
                                                    }
                                                    <Flex direction='column'>
                                                        <Text align='center'
                                                            style={{
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis'
                                                            }}
                                                            fontSize='9pt'
                                                            fontWeight={500}
                                                        >
                                                            {`${item.id}`}
                                                        </Text>
                                                        <Flex direction='row'>
                                                            <Text fontSize='8pt' fontWeight='bold' mr={1}>{Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(item.numberOfMembers)}</Text>
                                                            <Text fontSize='8pt'>joined</Text>
                                                        </Flex>
                                                    </Flex>
                                                </Flex>
                                            </Flex>
                                            <Box position='absolute' right='10px'>
                                                <Button
                                                    height='22px'
                                                    fontSize='8pt'
                                                    variant={isJoined ? "outline" : "solid"}
                                                    onClick={event => {
                                                        event.stopPropagation();
                                                        onJoinOrLeaveCommunity(item, isJoined);
                                                    }}
                                                >
                                                    {isJoined ? "Joined" : "Join"}
                                                </Button>
                                            </Box>
                                        </Flex>
                                    </Link>
                                )
                            })}
                            <Box p='10px 20px'>
                                <Button height='30px' width='100%' fontSize='9pt'>View All</Button>
                            </Box>
                        </>
                    )
                }
            </Flex>
        </Flex>
    )
}
export default Recommendations;