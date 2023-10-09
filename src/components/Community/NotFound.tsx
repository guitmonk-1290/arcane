import React from "react"
import {Flex, Button, Text} from "@chakra-ui/react"
import Link from "next/link"
import { FaRegFaceDizzy } from "react-icons/fa6"
import Image from "next/image"
import { IconContext } from "react-icons/lib"

const CommunityNotFound: React.FC = () => {
    return (
        <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            minHeight="60vh"
            >
                <IconContext.Provider value={{color: '#707375', size: '80px'}}>
                    <FaRegFaceDizzy />
                </IconContext.Provider>
                <Text mt={4}>
                    Sorry, the community does not exist or has been banned
                </Text>
                <Link href="/">
                    <Button mt={4}>Go Home</Button>
                </Link>
        </Flex>
    )
}

export default CommunityNotFound;