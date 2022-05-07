import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pic, setPic] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setloading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const handleShow = () => setShow(!show);

  const postDetails = async (pics) => {
    setloading(true);

    if (pics === undefined) {
      toast({
        title: 'Please, select an image',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });

      return;
    }

    try {
      if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
        let data = new FormData();
        data.append('file', pics);
        data.append('upload_preset', 'chat-app');
        data.append('cloud_name', 'dk5vifwlv');

        const res = await axios.post(
          'https://api.cloudinary.com/v1_1/dk5vifwlv/image/upload',

          data
        );

        setPic(res.data.url);
        setloading(false);
      } else {
        toast({
          title: 'Please, select an image',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
        setloading(false);
        return;
      }
    } catch (error) {
      console.log(error.message);
      setloading(false);
    }
  };

  const handleSubmit = async () => {
    setloading(true);

    if (!name || !email || !password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
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
        '/api/auth/register',
        {
          name,
          email,
          password,
          pic,
        },
        config
      );

      toast({
        title: 'Registration successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      setloading(false);

      localStorage.setItem('userInfo', JSON.stringify(data));

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
      <FormControl id='first-name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder='Enter your name'
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

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

      <FormControl id='password' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'type' : 'password'}
            placeholder='Enter your password'
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width={'4.5rem'}>
            <Button h='1.75rem' size={'sm'} onClick={handleShow}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='pic' isRequired>
        <FormLabel>Upload your picture</FormLabel>
        <Input
          type={'file'}
          p={1.5}
          accept='image/*'
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme={'blue'}
        width='100%'
        style={{ marginTop: 15 }}
        onClick={handleSubmit}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
