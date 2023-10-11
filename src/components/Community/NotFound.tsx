import React from "react"
import { Flex, Button, Text } from "@chakra-ui/react"
import Link from "next/link"
import { FaRegFaceDizzy } from "react-icons/fa6"
import Image from "next/image"
import { IconContext } from "react-icons/lib"
import Recommendations from "./Recommendations"

const CommunityNotFound: React.FC = () => {
    return (
        <>
            <Flex
                direction="column"
                justifyContent="center"
                alignItems="center"
                minHeight="30vh"
                p={2}
            >
                <IconContext.Provider value={{ color: '#707375', size: '80px' }}>
                    <FaRegFaceDizzy />
                </IconContext.Provider>
                <Text
                    mt={2}
                    align='center'
                >
                    Sorry, the arc either does not exist or has been removed.
                </Text>
                <Link href="/">
                    <Button mt={4}>Back to Home</Button>
                </Link>
            </Flex>
            <Flex 
                direction='column'
                flexGrow={1}
                p={2}
                ml={'auto'}
                mr={'auto'}
                maxWidth='600px'
            >
                <Recommendations />
            </Flex>
        </>
    )
}

export default CommunityNotFound;