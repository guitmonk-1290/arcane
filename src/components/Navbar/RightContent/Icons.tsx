import { Box, Icon, Flex, Menu, MenuButton, MenuDivider, MenuItem, MenuList } from '@chakra-ui/react';
import { BsArrowUpRightCircle, BsChatDots } from "react-icons/bs"
import { GrAdd } from "react-icons/gr"
import { Show, Hide } from "@chakra-ui/react"

import {
    IoFilterCircleOutline,
    IoNotificationsOutline,
    IoVideocamOutline
} from "react-icons/io5";

import React from 'react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { CgProfile } from 'react-icons/cg';
import { FaUser } from 'react-icons/fa';
import { MdOutlineLogin } from 'react-icons/md';
import { VscAccount } from 'react-icons/vsc';
import { HiOutlineMenuAlt3 } from "react-icons/hi"


const Icons: React.FC = () => {

    return (
        <Flex>
            <Flex
                display={{ base: "none", md: "flex" }} align='center'
                borderRight="1px solid"
                borderColor="gray.200"
            >
                {/* edit icons later */}
                <Flex
                    mr={1.5}
                    ml={1.5}
                    padding={1}
                    cursor='pointer'
                    _hover={{ bg: "gray.200" }}
                >
                    <Icon as={BsArrowUpRightCircle} fontSize={18} />
                </Flex>
                <Flex
                    mr={1.5}
                    ml={1.5}
                    padding={1}
                    cursor='pointer'
                    _hover={{ bg: "gray.200" }}
                >
                    <Icon as={IoFilterCircleOutline} fontSize={20} />
                </Flex>
                <Flex
                    mr={1.5}
                    ml={1.5}
                    padding={1}
                    cursor='pointer'
                    _hover={{ bg: "gray.200" }}
                >
                    <Icon as={IoVideocamOutline} fontSize={20} />
                </Flex>
            </Flex>

            <Show above="md">
                <Flex
                    mr={1.5}
                    ml={1.5}
                    padding={1}
                    cursor='pointer'
                    _hover={{ bg: "gray.200" }}
                >
                    <Icon as={BsChatDots} fontSize={20} />
                </Flex>
                <Flex
                    mr={1.5}
                    ml={1.5}
                    padding={1}
                    cursor='pointer'
                    _hover={{ bg: "gray.200" }}
                >
                    <Icon as={IoNotificationsOutline} fontSize={20} />
                </Flex>
                <Flex
                    mr={1.5}
                    ml={1.5}
                    padding={1}
                    cursor='pointer'
                    _hover={{ bg: "gray.200" }}
                >
                    <Icon as={GrAdd} fontSize={20} />
                </Flex>
            </Show>

            <Show below='md'>
                <Menu size='full'>
                    <MenuButton
                        cursor="pointer"
                        padding="0px 6px"
                        borderRadius={4}
                        _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
                    >
                        <Flex align="center">
                            <Flex align="center">
                                <Icon fontSize={24} mr={1} color="gray.400" as={HiOutlineMenuAlt3}></Icon>
                            </Flex>
                            <ChevronDownIcon />
                        </Flex>
                    </MenuButton>
                    <MenuList>
                        <MenuItem
                            fontSize='10pt'
                            fontWeight={700}
                            _hover={{ bg: "blue.500", color: "white" }}>
                            <Flex align='center'>
                                <Icon fontSize={20} mr={2} as={CgProfile} />
                                Profile
                            </Flex>
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem
                            fontSize='10pt'
                            fontWeight={700}
                            _hover={{ bg: "blue.500", color: "white" }}
                            onClick={() => {}}>
                            <Flex align='center'>
                                <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
                                Log Out
                            </Flex>
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Show>

        </Flex>
    )
}
export default Icons;