import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Stack, useToast, Text } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { ChatState } from '../context/ChatProvider';
import ChatLoading from '../components/ChatLoading';
import { getSender } from '../config/chatLogic';

const MyChats = () => {
  // const [loggedUser, setLoggedUser] = useState();
  const { user, setSelectedChat, selectedChat, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/chats`, config);
      console.log(data);
      setChats(data);
    } catch (error) {
      console.log(error.message);
      toast({
        title: 'Error Occurred!',
        description: 'Failed to load chats',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });

      return;
    }
  };

  useEffect(() => {
    // console.log(user);
    // setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
  }, []);


  return (
    <Box
      d={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir='column'
      alignItems={'center'}
      p={3}
      bg='white'
      w={{ base: '100%', md: '31%' }}
      borderRadius='lg'
      borderWidth={'1px'}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: '20px', md: '25px' }}
        fontFamily='Work sans'
        d='flex'
        w='100%'
        justifyContent='space-between'
        alignItems='center'
      >
        My Chats
        <Button
          d='flex'
          fontSize={{ base: '17px', md: '10px', lg: '17px' }}
          rightIcon={<AddIcon />}
        >
          New Group Chat
        </Button>
        {/* <GroupChatModal>
         
        </GroupChatModal> */}
      </Box>

      <Box
        d='flex'
        flexDir='column'
        p={3}
        bg='#F8F8F8'
        w='100%'
        h='100%'
        borderRadius='lg'
        overflowY='hidden'
      >
        {chats ? (
          <Stack overflowY='scroll'>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor='pointer'
                bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                color={selectedChat === chat ? 'white' : 'black'}
                px={3}
                py={2}
                borderRadius='lg'
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(user, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
