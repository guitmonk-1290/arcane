import React from 'react';
import { Button, Flex } from '@chakra-ui/react';
import AuthButtons from './AuthButtons';
import AuthModal from '../../Modal/Auth/AuthModal';
import { User, getAuth, signOut } from 'firebase/auth';
import { app } from '@/src/firebase/clientApp';
import Icons from './Icons';
import UserMenu from './UserMenu';

type RightContentProps = {
    user?: User | null;
};

const RightContent:React.FC<RightContentProps> = (props) => {
    const auth = getAuth(app);
    return (
        <>
            <AuthModal />
            <Flex justify='center' align='center'>
                {props.user ? <Icons /> : <AuthButtons />}
                <UserMenu user={props.user}/>
            </Flex>
        </>
    )
}
export default RightContent;