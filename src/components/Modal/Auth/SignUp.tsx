import { authModalState } from '@/src/atoms/authModalAtom';
import { Button, Flex, Input, Text, Image, Box } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { app } from '@/src/firebase/clientApp';
import { User, getAuth } from 'firebase/auth';
import {FIREBASE_ERRORS} from "../../../firebase/errors"
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import {useEffect} from "react"

type SignUpProps = {

};

const SignUp:React.FC<SignUpProps> = () => {
    
    const setAuthModalState = useSetRecoilState(authModalState);
    // ------------------ multiple auths in files !!!! [SEE LATER]
    const auth = getAuth(app);
    const firestore = getFirestore(app);

    const [signUpForm, setSignUpForm] = useState({
        email: "",
        password: "",
        // should we handle this in client-side???
        confirmPassword: ""
    });

    const [error, setError] = useState('');

    const [
        createUserWithEmailAndPassword,     // function(email, pass)
        user,
        loading,
        userError,
    ] = useCreateUserWithEmailAndPassword(auth);

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (error) setError('');
        // check for password match
        if (signUpForm.password !== signUpForm.confirmPassword) {
            setError('Passwords do not match')
            return;
        }
        createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // update form state
        setSignUpForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    };

    const createUserDocument = async (user: User) => {
        await addDoc(collection(firestore, 'users'), JSON.parse(JSON.stringify(user)));
    }

    useEffect(() => {
        if (user) {
            createUserDocument(user.user);
        }
    }, [user])

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
            <Input
                required
                name='confirmPassword'
                type='password'
                placeholder='confirm password'
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
            <Text textAlign='center' fontSize='10pt' color='red'>
                {error || FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]} 
            </Text>
            <Button 
            width='100%' height='36px' 
            mt={2} mb={2} 
            type='submit' 
            isLoading={loading}
            >
                Log In
            </Button>
            <Flex 
            fontSize='9pt' 
            justifyContent='center'
            m={1}>
                <Text mr={1}>Already have an account?</Text>
                <Text color='blue.500' 
                fontWeight={700}
                cursor='pointer'
                onClick={() => setAuthModalState((prev) => ({
                    ...prev,
                    view: 'login'
                }))}
                >
                    Log In
                </Text>
            </Flex>
        </form>
    )
}
export default SignUp;