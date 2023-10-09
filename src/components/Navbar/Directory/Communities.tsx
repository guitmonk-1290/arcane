import React, { useEffect, useState } from 'react';
import CreateCommunityModal from '../../Modal/CreateCommunity/CreateCommunityModal';
import { Box, Flex, Icon, MenuItem, Text, Image, Divider } from '@chakra-ui/react';
import {GrAdd} from "react-icons/gr"
import {BiGame} from "react-icons/bi"
import { useRecoilValue } from 'recoil';
import { communityState } from '@/src/atoms/communitiesAtom';
import MenuListItem from './MenuListItem';
import useCommunityData from '@/src/hooks/useCommunityData';
import useDirectory from '@/src/hooks/useDirectory';
import { useRouter } from 'next/router';

type CommunitiesProps = {
    
};

const Communities:React.FC<CommunitiesProps> = () => {
    const [open, setOpen] = useState(false);
    const { toggleMenuOpen } = useDirectory();
    //const mySnippets = useRecoilValue(communityState).mySnippets;
    const {communityStateValue} = useCommunityData();
    const mySnippets = communityStateValue.mySnippets;
    const router = useRouter();

    return (
        <>
            <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
            <MenuItem width='100%' fontSize='10pt' _hover={{bg: "gray.100"}}
            onClick={() => {
                setOpen(true);
                toggleMenuOpen();
            }}>
                <Flex align="center">
                    <Icon fontSize={20} mr={2} as={GrAdd}/>
                    Create Community
                </Flex>
            </MenuItem>
            <Box mt={3} mb={4}>
                <Text 
                    pl={3} 
                    mb={1} 
                    fontSize='7pt' 
                    fontWeight={500}
                    color='gray.600'
                >
                    ARCS CREATED {`(${mySnippets
                    .filter((snippet) => snippet.isModerator).length})`}
                </Text>
                {mySnippets
                    .filter((snippet) => snippet.isModerator)
                    .map((snippet) => (
                        <MenuListItem 
                            key={snippet.communityId}
                            icon={BiGame}
                            displayText={snippet.communityId}
                            link={`/arc/${snippet.communityId}`}
                            iconColor='red.500'
                            imageURL={snippet.imageURL}
                        />
                ))}
            </Box>
            <Divider />
            <Box mt={3} mb={4}>
                <Text 
                    pl={3} 
                    mb={1} 
                    fontSize='7pt' 
                    fontWeight={500}
                    color='gray.500'
                >
                    ARCS JOINED {`(${mySnippets.length})`}
                </Text>
                {mySnippets.map((snippet) => (
                    <MenuListItem 
                        key={snippet.communityId}
                        icon={BiGame}
                        displayText={snippet.communityId}
                        link={`/arc/${snippet.communityId}`}
                        iconColor='blue.500'
                        imageURL={snippet.imageURL}
                    />
                ))}
            </Box>
        </>
    )
}
export default Communities;