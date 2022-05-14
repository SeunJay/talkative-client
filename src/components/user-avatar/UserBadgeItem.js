import { CloseIcon } from '@chakra-ui/icons';
import { Badge } from '@chakra-ui/react';
import { ChatState } from '../../context/ChatProvider';

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  const { user: loggedInUser } = ChatState();

  return (
    <Badge
      px={2}
      py={1}
      borderRadius='lg'
      m={1}
      mb={2}
      variant='solid'
      fontSize={12}
      colorScheme='purple'
      cursor='pointer'
      onClick={handleFunction}
    >
      {loggedInUser._id === user._id ? 'You' : user.name}
      {admin === user._id && <span> (Admin)</span>}
      <CloseIcon pl={1} />
    </Badge>
  );
};

export default UserBadgeItem;
