import { Timestamp } from "firebase/firestore";
import {atom} from "recoil"

export interface Community {
    id: string;
    creatorId: string;
    numberOfMembers: number;
    privacyType: 'public' | 'restricted' | 'private';
    createdAt?: Timestamp;
    imageURL?: string;
    bannerURL?: string;
}

export interface CommunitySnippet {
    communityId: string;
    isModerator?: boolean;
    imageURL?: string;
}

interface CommunityState {
    mySnippets: CommunitySnippet[];
    currentCommunity?: Community;
    fetchedSnippets: boolean;
}

const defaultCommunityState: CommunityState = {
     mySnippets: [],
     fetchedSnippets: false
}

export const communityState = atom<CommunityState>({
    key: 'communityState',
    default: defaultCommunityState,
})