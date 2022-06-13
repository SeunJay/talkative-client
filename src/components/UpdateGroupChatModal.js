import { ViewIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import UserBadgeItem from './user-avatar/UserBadgeItem';
import UserListItem from './user-avatar/UserListItem';

const UpdateGroupChatModal = ({
  fetchAgain,
  setFetchAgain,
  fetchChatMessages,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const [groupChatName, setGroupChatName] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();

  const handleRemove = async (userToRemove) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToRemove._id !== user._id
    ) {
      toast({
        title: 'Only Admins can add a user!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.patch(
        `/api/chats/group/remove-user`,
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchChatMessages();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Error Occured!',
        description: 'Failed to remove user to group',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.patch(
        `/api/chats/group/rename/`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setRenameLoading(false);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setGroupChatName('');
    } catch (error) {
      setRenameLoading(false);
      toast({
        title: 'Error Occurred!',
        description: 'Failed to rename group chat',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }
  };

  const handleSearch = async (query) => {
    if (!query) {
      return;
    }

    setSearch(query);

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/users?search=${search}`, config);
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to Load the Search Results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const handleAddUser = async (userToUser) => {
    if (selectedChat.users.find((user) => user._id === userToUser._id)) {
      toast({
        title: 'User Already in the group!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: 'Only Admins can add a user!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.patch(
        `/api/chats/group/add-user`,
        {
          chatId: selectedChat._id,
          userId: userToUser._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Error Occured!',
        description: 'Failed to add user to group',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
  };

  return (
    <>
      <IconButton d={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={'30px'}
            fontFamily='Work sans'
            d='flex'
            justifyContent={'center'}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d='flex' flexDir='column' alignItems='center'>
            <Box w='100%' d='flex' flexWrap='wrap' pb={3}>
              {selectedChat.users.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleRemove(user)}
                />
              ))}
            </Box>
            <FormControl d='flex'>
              <Input
                placeholder='Chat Name'
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />

              <Button
                variant='solid'
                colorScheme={'teal'}
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>

            <FormControl>
              <Input
                placeholder='Add user to group'
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size='lg' />
            ) : (
              searchResults?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
