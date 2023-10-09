import {atom} from 'recoil'

export interface postModalState {
    open: boolean;
    view: 'post' | 'follow' | 'upload';
} 

const defaultPostModalState: postModalState = {
    open: false,
    view: 'post'
}

export const postModalState = atom<postModalState>({
    key: 'postModalState',
    default: defaultPostModalState,
})