import React, { useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setloading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const handleShow = () => setShow(!show);

  const handleSubmit = async () => {
    setloading(true);

    if (!email || !password) {
      toast({
        title: 'Please, fill all the fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setloading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/auth/login',
        {
          email,
          password,
        },
        config
      );

      toast({
        title: 'Login successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setloading(false);

      localStorage.setItem('userInfo', JSON.stringify(data));

      // history.push('/chats');
      navigate('/chats');
    } catch (error) {
      toast({
        title: 'Error occurred',
        status: 'error',
        description: error.response.data.message,
        duration: 5000,
        isClosable: true,
        position: 'top',
      });

      setloading(false);
    }
  };

  return (
    <VStack spacing={'5px'}>
      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder='Enter your email'
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'type' : 'password'}
            placeholder='Enter your password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width={'4.5rem'}>
            <Button h='1.75rem' size={'sm'} onClick={handleShow}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme={'blue'}
        width='100%'
        style={{ marginTop: 15 }}
        onClick={handleSubmit}
        isLoading={loading}
      >
        Login
      </Button>

      <Button
        colorScheme={'red'}
        variant='solid'
        width='100%'
        onClick={() => {
          setEmail('guest@example.com');
          setPassword('123456');
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
