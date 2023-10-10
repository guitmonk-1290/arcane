import { Flex, Button, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import {app} from "../../../firebase/clientApp"
import { User, getAuth } from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { useEffect } from "react"

type OAuthButtonsProps = {
    
};

const OAuthButtons:React.FC<OAuthButtonsProps> = () => {

    const auth = getAuth(app);
    const firestore = getFirestore(app);
    const [
        signInWithGoogle,
        user,
        loading,
        error
    ] = useSignInWithGoogle(auth);

    const createUserDocument = async (user: User) => {
        const userDocRef = doc(firestore, 'users', user.uid);
        await setDoc(userDocRef, JSON.parse(JSON.stringify(user)));
    }

    useEffect(() => {
        if (user) {
            createUserDocument(user.user);
        }
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user])
    
    return (
        <Flex direction='column' width='100%' mb={4}>
            <Button 
            variant='oauth'
            mb={2}
            isLoading={loading}
            onClick={() => signInWithGoogle()} >
                <Image
                    alt='Sign In with Google' 
                    src='/images/google.png' 
                    height='30px' mr={2}
                />
                <Text color='black'>Continue with Google</Text>
            </Button>
            <Button variant='oauth' mb={2}
            >
                <Image src='/images/facebook.png' height='20px' mr={4}/>
                <Text color='black'>Continue with Facebook</Text>
            </Button>
            <Button 
            variant='anonym'
            width='100%' height='36px' mb={2}  type='submit'>
                Continue as Anonymous
            </Button>
            {error && <Text fontSize='10pt' color='red'>{error.message}</Text>}
        </Flex>    
    )
}
export default OAuthButtons;