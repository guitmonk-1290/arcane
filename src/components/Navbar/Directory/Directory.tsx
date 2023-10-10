import { authModalState } from '@/src/atoms/authModalAtom';
import { app } from '@/src/firebase/clientApp';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, Icon, Menu, MenuButton, MenuList, Text, Image } from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { CgCommunity } from "react-icons/cg"
import Communities from './Communities';
import useDirectory from '@/src/hooks/useDirectory';

const UserMenu: React.FC = () => {

    const {
        directoryState,
        toggleMenuOpen,
    } = useDirectory();

    const auth = getAuth(app);
    const setAuthModalState = useSetRecoilState(authModalState);

    return (
        <Menu isOpen={directoryState.isOpen}>
            <MenuButton
                cursor="pointer"
                padding="0px 6px"
                mr={1}
                ml={{base:3, md:2}}
                borderRadius={4}
                _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
                onClick={toggleMenuOpen}
                boxShadow='rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px'
            >
                <Flex 
                    align="center" 
                    justify="space-between" 
                    width={{base: "auto", lg: "200px"}}
                >
                    <Flex align="center">
                        {
                            directoryState.selectedMenuItem.imageURL ? (
                                <Image 
                                    alt=''
                                    src={directoryState.selectedMenuItem.imageURL}
                                    borderRadius='full'
                                    boxSize='24px'
                                    mr={2}
                                />
                            ) : (
                                <Icon 
                                    fontSize={24} 
                                    mr={{ base: 0, md: 2 }} 
                                    ml={1}
                                    as={directoryState.selectedMenuItem.icon}
                                    color={directoryState.selectedMenuItem.iconColor}
                                />
                            )
                        }
                        <Flex display={{base: "none", lg: "flex"}}>
                            <Text fontWeight={600} fontSize="9pt">
                                {directoryState.selectedMenuItem.displayText}
                            </Text>
                        </Flex>
                    </Flex>
                    <ChevronDownIcon />
                </Flex>
            </MenuButton>
            <MenuList>
                <Communities />
            </MenuList>
        </Menu>
    )
}
export default UserMenu;