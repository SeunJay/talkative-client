import { ViewIcon } from '@chakra-ui/icons';
import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h='400px'>
          <ModalHeader
            fontSize={'25px'}
            fontFamily='Work sans'
            d='flex'
            justifyContent={'center'}
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d='flex'
            flexDir={'column'}
            alignItems='center'
            justifyContent={'space-between'}
          >
            <Image
              borderRadius={'full'}
              boxSize='150px'
              src={user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: '20px', md: '25px' }}
              fontFamily='Work sans'
            >
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProfileModal;
