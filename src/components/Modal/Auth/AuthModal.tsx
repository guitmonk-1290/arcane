import React, { useEffect } from 'react';
import {  
    Modal, 
    ModalOverlay, 
    ModalContent, 
    ModalHeader, 
    ModalCloseButton, 
    ModalBody, 
    ModalFooter, 
    Flex,
    Text
} from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { authModalState } from '@/src/atoms/authModalAtom';
import Authinputs from './AuthInputs';
import OAuthButtons from './OAuthButtons';
import {app} from "../../../firebase/clientApp"
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import ResetPassword from './ResetPassword';

const AuthModal: React.FC = () => {
    const auth = getAuth(app);
    const [modalState, setModalState] = useRecoilState(authModalState);
    const [
        user,
        loading,
        error
    ] = useAuthState(auth);

    const handleClose = () => {
        setModalState((prev) => ({
            ...prev,
            open: false,
        }))
    };

    useEffect(() => {
        if (user) handleClose();
        console.log("user: ", user);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user])

    return (
        <>
            <Modal isOpen={modalState.open} onClose={handleClose} size='sm'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign='center'>
                        {modalState.view === 'login' && 'Login'}
                        {modalState.view === 'signup' && 'Sign Up'}
                        {modalState.view === 'resetPassword' && 'Reset Password'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody 
                    display='flex' 
                    flexDirection='column' 
                    alignItems='center' 
                    justifyContent='center'
                    pb={6}
                    >
                        <Flex 
                        direction='column' 
                        align='center' 
                        justify='center' 
                        width='70%'
                        >
                            {modalState.view==='login' || modalState.view==='signup' ? (
                                <>
                                    <OAuthButtons />
                                    <Text color='gray.400' fontWeight={500}>OR</Text>
                                    <Authinputs />
                                </>
                            ) : (
                                <ResetPassword />
                            )}
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}
export default AuthModal;