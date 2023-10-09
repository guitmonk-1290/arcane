import AuthButtons from '@/src/components/Navbar/RightContent/AuthButtons';
import { Flex, Textarea, Button, Text, Icon } from '@chakra-ui/react';
import {GrEmoji} from "react-icons/gr"
import { User } from 'firebase/auth';
import React from 'react';
import { color } from 'framer-motion';

type CommentInputProps = {
    comment: string;
    setCommentText: (value: string) => void;
    user: User;
    createLoading: boolean;
    onCreateComment: (commentText: string) => void;
};

const CommentInput: React.FC<CommentInputProps> = ({
    comment,
    setCommentText,
    user,
    createLoading,
    onCreateComment
}) => {

    return (
        <Flex direction="column" position="relative" mt={2}>
            {user ? (
                <>
                    <Text mb={1}>
                        Comment as{" "}
                        <span style={{ color: "#3182CE" }}>
                            {user?.email?.split("@")[0]}
                        </span>
                    </Text>
                    <Textarea
                        value={comment}
                        onChange={(event) => setCommentText(event.target.value)}
                        placeholder="What are your thoughts?"
                        fontSize="10pt"
                        borderRadius={4}
                        minHeight="160px"
                        pb={10}
                        _placeholder={{ color: "gray.500" }}
                        _focus={{
                            outline: "none",
                            bg: "white",
                            border: "1px solid black",
                        }}
                    />
                    <Flex
                        position="absolute"
                        left="1px"
                        right={0.1}
                        bottom="1px"
                        justify="flex-end"
                        bg="gray.100"
                        p="6px 8px"
                        borderRadius="0px 0px 4px 4px"
                    >
                        <Icon 
                            as={GrEmoji}
                            color='gray.400'
                            fontSize={25} 
                            mr={2}
                            mt='auto'
                            cursor='pointer'
                            _hover={{ color: 'blue.400' }}
                            onClick={()=>{}}
                        />
                        <Button
                            height="26px"
                            disabled={!comment.length}
                            isLoading={createLoading}
                            onClick={() => onCreateComment(comment)}
                        >
                            Comment
                        </Button>
                    </Flex>
                </>
            ) : (
                <Flex
                    align="center"
                    justify='center'
                    borderRadius={2}
                    border="1px solid"
                    borderColor="gray.100"
                    p={4}
                >
                    <Text fontWeight={600} mr={4}>Log in or sign up to leave a comment</Text>
                    <AuthButtons />
                </Flex>
            )}
        </Flex>
    );
}
export default CommentInput;