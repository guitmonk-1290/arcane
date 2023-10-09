import React from 'react';
import { Comment } from './Comments';
import { Box, Flex, Icon, Spinner, Stack, Text } from '@chakra-ui/react';
import { BiGame } from 'react-icons/bi';
import moment from 'moment';
import { IoArrowDownCircleOutline, IoArrowUpCircleOutline } from 'react-icons/io5';

type CommentItemProps = {
    comment: Comment;
    onDeleteComment: (comment: Comment) => void;
    loadingDelete: boolean;
    userId: string;
};

const CommentItem:React.FC<CommentItemProps> = ({
    comment,
    onDeleteComment,
    loadingDelete,
    userId
}) => {
    
    return (
        <Flex>
            <Box mr={2}>
                <Icon as={BiGame} fontSize={30} color='gray.300'/>
            </Box>
            <Stack spacing={1}>
                <Stack direction='row' align='center' fontSize='8pt'>
                    <Text fontWeight={700}>{comment.creatorDisplayName}</Text>
                    <Text color='gray.600'>{moment(new Date(comment.createdAt?.seconds * 1000)).fromNow()}</Text>
                    {loadingDelete && <Spinner size="sm" />}
                </Stack>
                <Text fontSize='10pt'>{comment.text}</Text>
                <Stack 
                    direction='row' 
                    align='center' 
                    cursor='pointer' 
                    color='gray.500'
                >
                    <Icon as={IoArrowUpCircleOutline} />
                    <Icon as={IoArrowDownCircleOutline} />
                    {userId === comment.creatorId && (
                        <>
                            <Text fontSize='9pt' _hover={{ color: 'blue.500' }}>Edit</Text>
                            <Text fontSize='9pt' _hover={{ color: 'blue.500' }} onClick={() => onDeleteComment(comment)}>Delete</Text>
                        </>
                    )}
                </Stack>
            </Stack>
        </Flex>
    )
}
export default CommentItem;