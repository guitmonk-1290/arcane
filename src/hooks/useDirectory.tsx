import React, { useEffect } from 'react';
import { DirectoryMenuItem, directoryMenuState } from '../atoms/DirectoryMenuAtom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';
import { communityState } from '../atoms/communitiesAtom';
import { BiGame } from 'react-icons/bi';


const useDirectory = () => {
    
    const [directoryState, setDirectoryState] = useRecoilState(directoryMenuState);
    const router = useRouter();
    const communityStateValue = useRecoilValue(communityState);

    const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
        setDirectoryState(prev => ({
            ...prev,
            selectedMenuItem: menuItem
        }))
        router.push(menuItem.link);
        if (directoryState.isOpen) {
            toggleMenuOpen();
        }
    }

    const toggleMenuOpen = () => {
        setDirectoryState(prev => ({
            ...prev,
            isOpen: !directoryState.isOpen
        }))
    }

    useEffect(() => {
        const {currentCommunity} = communityStateValue;
        if (currentCommunity) {
            setDirectoryState(prev => ({
                ...prev,
                selectedMenuItem: {
                    displayText: currentCommunity.id,
                    link: `/r/${currentCommunity.id}`,
                    imageURL: currentCommunity.imageURL,
                    icon: BiGame,
                    iconColor: 'blue.500'
                }
            }))
        }
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [communityStateValue.currentCommunity])

    return {
        directoryState,
        toggleMenuOpen,
        onSelectMenuItem
    };
}
export default useDirectory;