import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatsPage = () => {
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    const { data } = await axios.get('/api/chats');
    console.log(data);
  };

  useEffect(() => {
    fetchChats();
  }, []);
  return <div>ChatsPage</div>;
};

export default ChatsPage;
