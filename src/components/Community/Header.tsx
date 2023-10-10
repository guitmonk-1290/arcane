import { Community, communityState } from '@/src/atoms/communitiesAtom';
import { Box, Button, Flex, Icon, Image, Text } from '@chakra-ui/react';
import {BiGame} from "react-icons/bi"
import React, { useState } from 'react';
import useCommunityData from '@/src/hooks/useCommunityData';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { app } from '@/src/firebase/clientApp';

type HeaderProps = {
    communityData: Community    
};

const Header:React.FC<HeaderProps> = ({ communityData }) => {

    // banner for the community

    const { communityStateValue, onJoinOrLeaveCommunity, loading } = useCommunityData();
    const isJoined = !!communityStateValue.mySnippets.find(item => item.communityId === communityData.id)
    const banner = communityStateValue.currentCommunity?.bannerURL;

    return (
        <Flex 
            direction='column' 
            width='100%' 
            height={banner ? '404px ' : '184px'}
        >
            <Box 
                height={banner ? '334px' : '50%'} 
                overflow='hidden'
                bg={banner ? 'blue.400' : 'blue.400'}
            >
                {
                    banner && 
                        <Image 
                            alt='Community Banner'
                            width='100%'
                            src={banner}
                            height='110%'
                            //height='684px'
                        />
                }
            </Box>
            <Flex 
                justify='center' 
                bg='white' 
                flexGrow={1}
            >
                <Flex width='95%' maxWidth='964px'>
                    {communityStateValue.currentCommunity?.imageURL ? 
                        <Image 
                            src={communityStateValue.currentCommunity.imageURL}
                            borderRadius='full'
                            boxSize='66px'
                            alt=''
                            position='relative'
                            top={-4}
                            color='blue.500'
                            border='6px solid white'
                        />
                        :
                        <Icon 
                            as={BiGame}
                            position='relative'
                            bg="white"
                            fontSize={64}
                            borderRadius='50px'
                            top={-5} 
                        />
                    }
                    <Flex m={2}>
                        <Flex direction='column' mr={6}>
                            <Text
                                fontWeight={800}
                                fontSize='18pt'
                            >
                                {communityData.id}
                            </Text>
                            <Text
                                fontWeight={400}
                                fontSize='10pt'
                            >
                                arc/{communityData.id}
                            </Text>
                        </Flex>
                        <Button 
                            variant={isJoined ? 'outline' : 'solid'}
                            height='30px'
                            pr={6} pl={6}
                            isLoading={loading}
                            onClick={() => {onJoinOrLeaveCommunity(communityData, isJoined)}}
                            mt={1}
                            >
                                {isJoined ? "Joined" : "Join"}
                        </Button>
                    </Flex>
                </Flex>
            </Flex>    
        </Flex>
    )
}
export default Header;