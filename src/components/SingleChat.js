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
import io from 'socket.io-client';
import React, { useEffect, useState, useRef } from 'react';
import { getSender, getSenderFull } from '../config/chatLogic';
import { ChatState } from '../context/ChatProvider';
import ProfileModal from './ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import './styles.css';
import ScrollableChat from './ScrollableChat';

const END_POINT = 'http://localhost:8000';

let selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  let socket = useRef(null);

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  const toast = useToast();

  useEffect(() => {
    socket.current = io(END_POINT);

    socket.current.emit('setup', user);
    socket.current.on('connected', () => setIsSocketConnected(true));
    socket.current.on('typing', () => {
      console.log('typing....')
      setIsTyping(true)
    });
    socket.current.on('stop-typing', () => setIsTyping(false));
    // socket.current.on('greetings', (data) => console.log(data));

    return () => socket.current.disconnect();
    // eslint-disable-next-line
  }, []);

  // console.log(isTyping);

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

      setLoading(false);

      setMessages(data);

      socket.current.emit('join-chat', selectedChat._id);
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
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    // socket.current.on('greetings', (data) => console.log(data));

    socket.current.on('message-received', (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        //send notification
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        // console.log('newMessageReceived', newMessageReceived);
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const sendMessage = async (e) => {
    if (e.key === 'Enter' && newMessage) {
      socket.current.emit('stop-typing', selectedChat._id);
      try {
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

        socket.current.emit('new-message', data);
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

    socket.current.emit('greeting-request', selectedChat._id);

    if (!isSocketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.current.emit('typing', selectedChat._id);
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();

      const timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.current.emit('stop-typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
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
              {isTyping ? <div>Typing...</div> : <></>}
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
