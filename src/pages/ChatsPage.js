import { Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import ChatBox from '../components/ChatBox';
import MyChats from '../components/MyChats';
import SideDrawer from '../components/SideDrawer';
import { ChatState } from '../context/ChatProvider';
// import axios from 'axios';

const ChatsPage = () => {
  const { user } = ChatState();

  const [fetchAgain, setFetchAgain] = useState(false);

  const fetchChats = async () => {
    // const { data } = await axios.get('/api/chats');
    // console.log(data);
  };

  useEffect(() => {
    fetchChats();
  }, []);
  return (
    <div style={{ width: '100%' }}>
      {user && <SideDrawer />}
      <Box
        d='flex'
        justifyContent={'space-between'}
        w='100%'
        h='91.5vh'
        p='10px'
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatsPage;
