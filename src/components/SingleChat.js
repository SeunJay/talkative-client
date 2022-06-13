import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  IconButton,
  Text,
  Spinner,
  FormControl,
  Input,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getSender, getSenderFull } from '../config/chatLogic';
import { ChatState } from '../context/ChatProvider';
import ProfileModal from './ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import './styles.css';
import ScrollableChat from './ScrollableChat';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const { user, selectedChat, setSelectedChat } = ChatState();

  const toast = useToast();

  const fetchChatMessages = async () => {
    if (!selectedChat) return;
    try {

      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/messages/${selectedChat._id}`,
        config
      );

      console.log(data);

      setLoading(false);

      setMessages(data);
    } catch (error) {
      setLoading(false);

      toast({
        title: 'Error Occured!',
        description: 'Failed to load messages',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, [selectedChat]);

  const sendMessage = async (e) => {
    if (e.key === 'Enter' && newMessage) {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage('');

        const { data } = await axios.post(
          '/api/messages',
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        console.log(data);

        setLoading(false);
        setMessages([...messages, data]);
      } catch (error) {
        setLoading(false);

        toast({
          title: 'Error Occured!',
          description: 'Failed to send message',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            w='100%'
            fontFamily='Work sans'
            d='flex'
            justifyContent={{ base: 'space-between' }}
            alignItems='center'
          >
            <IconButton
              d={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat('')}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchChatMessages={fetchChatMessages}
                />
              </>
            )}
          </Text>

          <Box
            d='flex'
            flexDir={'column'}
            justifyContent='flex-end'
            p={3}
            bg='#e8e8e8'
            w='100%'
            h='100%'
            borderRadius={'lg'}
            overflowY='hidden'
          >
            {loading ? (
              <Spinner
                size='xl'
                w={20}
                h={20}
                alignSelf='center'
                margin='auto'
              />
            ) : (
              <div className='messages'>
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant={'filled'}
                bg='#e0e0e0'
                placeholder='enter a message...'
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box d='flex' alignItems={'center'} justifyContent='center' h='100%'>
          <Text fontSize={'3xl'} pb={3} fontFamily='Work sans'>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
