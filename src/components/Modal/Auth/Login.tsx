import { authModalState } from '@/src/atoms/authModalAtom';
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useSetRecoilState } from 'recoil';
import {app} from "../../../firebase/clientApp"
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {FIREBASE_ERRORS} from "../../../firebase/errors"

type LoginProps = {

};

const Login: React.FC<LoginProps> = () => {
    const setAuthModalState = useSetRecoilState(authModalState);
    const auth = getAuth(app);

    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    })

    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error
    ] = useSignInWithEmailAndPassword(auth);

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        signInWithEmailAndPassword(loginForm.email, loginForm.password);
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // update form state
        setLoginForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    };

    return (
        <form onSubmit={onSubmit}>
            <Input
                required
                name='email'
                placeholder='email'
                type='email'
                mb={2}
                onChange={onChange}
                fontSize='10pt'
                _placeholder={{ colors: 'gray.500' }}
                _hover={{
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500'
                }}
                _focus={{
                    outline: 'none',
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500'
                }}
                bg='gray.50'
            />
            <Input
                required
                name='password'
                type='password'
                placeholder='password'
                onChange={onChange}
                fontSize='10pt'
                _placeholder={{ colors: 'gray.500' }}
                _hover={{
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500'
                }}
                _focus={{
                    outline: 'none',
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500'
                }}
                bg='gray.50'
                mb={2} />
            <Text fontSize='10pt' color='red' align='center'>
                {FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
            </Text>
            <Button width='100%' height='36px' mt={2} mb={2} type='submit' isLoading={loading}>
                Log In
            </Button>
            <Flex 
            fontSize='9pt' 
            justifyContent='center'
            m={2}>
                <Text mr={1}>Forgot your password?</Text>
                <Text color='blue.500' 
                fontWeight={700}
                fontSize='10pt'
                cursor='pointer'
                onClick={() => setAuthModalState((prev) => ({
                    ...prev,
                    view: 'resetPassword'
                }))}
                >
                    Reset here
                </Text>
            </Flex>
            <Flex 
            fontSize='9pt' 
            justifyContent='center'
            m={1}>
                <Text mr={1}>Need an acount?</Text>
                <Text color='blue.500' 
                fontWeight={700}
                cursor='pointer'
                onClick={() => setAuthModalState((prev) => ({
                    ...prev,
                    view: 'signup'
                }))}
                >
                    Sign Up
                </Text>
            </Flex>
        </form>
    )
}
export default Login;