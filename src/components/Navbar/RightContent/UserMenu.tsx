import { ChevronDownIcon } from '@chakra-ui/icons';
import { FaUser } from "react-icons/fa"
import { Button, Flex, Icon, Menu, MenuButton, MenuDivider, MenuItem, MenuList } from '@chakra-ui/react';
import { User, signOut, getAuth } from 'firebase/auth';
import { app } from '@/src/firebase/clientApp';
import { VscAccount } from "react-icons/vsc"
import { CgProfile } from "react-icons/cg"
import { MdOutlineLogin } from "react-icons/md"
import React from 'react';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import { authModalState } from '@/src/atoms/authModalAtom';
import { communityState } from '@/src/atoms/communitiesAtom';

type UserMenuProps = {
    user?: User | null;
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
    const resetCommunityState = useResetRecoilState(communityState);

    const auth = getAuth(app);
    const setAuthModalState = useSetRecoilState(authModalState);

    const logout = async () => {
        await signOut(auth);
        // clear community state
        resetCommunityState();
    }

    return (
        <Flex ml='auto'>
            <Menu>
                <MenuButton
                    cursor="pointer"
                    padding="0px 6px"
                    borderRadius={4}
                    _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
                >
                    <Flex align="center">
                        <Flex align="center">
                            {user ? (
                                <>
                                    <Icon
                                        fontSize={24}
                                        mr={0}
                                        color='gray.300'
                                        as={FaUser} />
                                </>
                            ) : (
                                <Icon fontSize={24} mr={1} color="gray.400" as={VscAccount}></Icon>
                            )}
                        </Flex>
                    </Flex>
                </MenuButton>
                <MenuList>
                    {user ? (
                        <>
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
                                onClick={logout}>
                                <Flex align='center'>
                                    <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
                                    Log Out
                                </Flex>
                            </MenuItem>
                        </>) :
                        (
                            <>
                                <MenuItem
                                    fontSize='10pt'
                                    fontWeight={700}
                                    _hover={{ bg: "blue.500", color: "white" }}
                                    onClick={() => setAuthModalState({ open: true, view: 'login' })}>
                                    <Flex align='center'>
                                        <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
                                        Log In / Sign Up
                                    </Flex>
                                </MenuItem>
                            </>
                        )}

                </MenuList>
            </Menu>
        </Flex>
    )
}
export default UserMenu;