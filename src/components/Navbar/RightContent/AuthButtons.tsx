import React from 'react';
import { Button } from '@chakra-ui/react';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '@/src/atoms/authModalAtom';

const AuthButtons:React.FC = () => {
    const setAuthModalState = useSetRecoilState(authModalState);

    return (
        <>
            <Button 
            variant='outline' 
            height='28px' 
            mr={2}
            display={{ base: 'none', sm: 'flex' }}
            width={{ base: '70px', md: '90px' }}
            onClick={() => setAuthModalState({open: true, view: 'login'})}
            >
                Log In
            </Button>
            <Button 
            variant='solid'
            height='28px'
            mr={2}
            display={{ base: 'none', sm: 'flex' }}
            width={{ base: '70px', md: '90px' }}
            onClick={() => setAuthModalState({open: true, view: 'signup'})}
            >
                Sign Up
            </Button>
        </>
    )
}
export default AuthButtons;