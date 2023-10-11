import React from 'react';
import {Flex, InputGroup, InputLeftElement, Input} from '@chakra-ui/react'
import {PhoneIcon, SearchIcon} from '@chakra-ui/icons'
import {Show, Hide} from "@chakra-ui/react"

type SearchInputProps = {
    
};

const SearchInput:React.FC<SearchInputProps> = () => {
    
    return (
        <Flex flexGrow={1} mr={2} align='center' ml={2}>
            <InputGroup>
                <InputLeftElement>
                    <SearchIcon color='gray.400' mb={1}/>
                </InputLeftElement>
                <Input 
                fontSize='10pt' 
                placeholder='Search for topics' 
                _placeholder={{ color: 'gray.500' }}
                _hover={{
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500'
                }}
                _focus={{
                    outline: 'none',
                    border: '1px solid',
                    borderColor: 'blue.500'
                }}
                height='34px'
                bg='gray.50'
                />
            </InputGroup>
        </Flex>
    )
}
export default SearchInput;