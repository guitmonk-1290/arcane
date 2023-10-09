import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import SearchInput from './SearchInput';
import RightContent from './RightContent/RightContent';
import {app} from "../../firebase/clientApp"
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import Directory from './Directory/Directory';
import useDirectory from '@/src/hooks/useDirectory';
import { defaultMenuItem } from '@/src/atoms/DirectoryMenuAtom';

const Navbar:React.FC = () => {
    const auth = getAuth(app);
    const [user, loading, error] = useAuthState(auth);
    const { onSelectMenuItem } = useDirectory();

    return (
        <Flex 
            bg="white"
            height='44px' 
            padding='6px 12px'
            minWidth='413px'  
            position='fixed'
            width='100%'
            zIndex={9999}
            top={0}
        >
            <Flex align='center'>
                <Text 
                fontSize='1.5em' 
                as='b' color='blue.500'
                mb={1} 
                // edit later for responsive logo 
                display={{base: 'set', md:'set'}}
                cursor='pointer'
                _hover={{ color: 'blue.400' }}
                onClick={() => onSelectMenuItem(defaultMenuItem)}
                >
                    arcane
                </Text>
            </Flex>
            {user && <Directory /> }
            <SearchInput />
            <RightContent user={user} />
        </Flex>
    )
}
export default Navbar;