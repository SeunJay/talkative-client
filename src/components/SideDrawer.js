import {
  Box,
  Button,
  Menu,
  MenuButton,
  Text,
  Tooltip,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  Input,
  DrawerHeader,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChatState } from '../context/ChatProvider';
import ProfileModal from './ProfileModal';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from './user-avatar/UserListItem';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();

  const navigate = useNavigate();

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(`/api/chats`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setLoadingChat(false);
      setSelectedChat(data);
      onClose();
    } catch (error) {
      toast({
        title: 'Error Occurred!',
        description: 'Failed to fetch chat',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      setLoadingChat(false);

      return;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please, enter something in the search box',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
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

      const { data } = await axios.get(`/api/users?search=${search}`, config);

      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      console.log(error.message);
      toast({
        title: 'Error Occurred!',
        description: 'Failed to load search results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      setLoading(false);

      return;
    }
  };

  return (
    <>
      <Box
        d='flex'
        justifyContent={'space-between'}
        alignItems='center'
        bg='white'
        w='100%'
        p='5px 10px 5px 10px'
        borderWidth={'5px'}
      >
        <Tooltip
          label='Search users to chat with'
          hasArrow
          placement='bottom-end'
        >
          <Button onClick={onOpen}>
            <i className='fas fa-search' />
            <Text d={{ base: 'none', md: 'flex' }} px='4'>
              Search user
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize={'2xl'} fontFamily='Work sans'>
          Talk-A-Tive
        </Text>

        <div className=''>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize={'2xl'} m={1} />
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size='sm'
                cursor='pointer'
                name={user?.name}
                src={user?.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                {/* <MenuItem>My Profile</MenuItem> */}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer isOpen={isOpen} placement='left' onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={'1px'}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box d='flex' pb={2}>
              <Input
                placeholder='Search by name or email'
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResults.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleAccessChat={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml='auto' d='flex' />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
