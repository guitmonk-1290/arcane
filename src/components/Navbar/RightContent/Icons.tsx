import { Box, Icon, Flex } from '@chakra-ui/react';
import {BsArrowUpRightCircle, BsChatDots} from "react-icons/bs"
import {GrAdd} from "react-icons/gr"

import {
    IoFilterCircleOutline,
    IoNotificationsOutline,
    IoVideocamOutline
} from "react-icons/io5";

import React from 'react';


const Icons:React.FC = () => {
    
    return (
        <Flex>
            <Flex 
                display={{base: "none", md: "flex"}} align='center'
                borderRight="1px solid"
                borderColor="gray.200"
            >
                {/* edit icons later */}
                <Flex 
                    mr={1.5} 
                    ml={1.5} 
                    padding={1} 
                    cursor='pointer'
                    _hover={{bg: "gray.200"}}
                    >
                    <Icon as={BsArrowUpRightCircle} fontSize={18} />
                </Flex>
                <Flex 
                    mr={1.5} 
                    ml={1.5} 
                    padding={1} 
                    cursor='pointer'
                    _hover={{bg: "gray.200"}}
                    >
                    <Icon as={IoFilterCircleOutline} fontSize={20}/>
                </Flex>
                <Flex 
                    mr={1.5} 
                    ml={1.5} 
                    padding={1} 
                    cursor='pointer'
                    _hover={{bg: "gray.200"}}
                    >
                    <Icon as={IoVideocamOutline} fontSize={20}/>
                </Flex>
            </Flex>
            <>
                <Flex 
                    mr={1.5} 
                    ml={1.5} 
                    padding={1} 
                    cursor='pointer'
                    _hover={{bg: "gray.200"}}
                    >
                    <Icon as={BsChatDots} fontSize={20}/>
                </Flex>
                <Flex 
                    mr={1.5} 
                    ml={1.5} 
                    padding={1} 
                    cursor='pointer'
                    _hover={{bg: "gray.200"}}
                    >
                    <Icon as={IoNotificationsOutline} fontSize={20}/>
                </Flex>
                <Flex 
                    mr={1.5} 
                    ml={1.5} 
                    padding={1} 
                    cursor='pointer'
                    _hover={{bg: "gray.200"}}
                    >
                    <Icon as={GrAdd} fontSize={20}/>
                </Flex>
            </>
        </Flex>
    )
}
export default Icons;