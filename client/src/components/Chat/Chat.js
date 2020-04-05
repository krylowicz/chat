import React, { useState, useEffect, useContext } from 'react';
import UserContext, { useAuthorization } from 'context/userContext';
import LogoutButton from 'components/LogoutButton/LogoutButton';
import Messages from '../Messages/Messages';

const getUsers = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/getUsers`, {
      headers: { 'authToken': localStorage.getItem('token')}
    });
    const { users } = await response.json();
    return users;
  } catch (error) {
    console.error(error);
  }
};

const getFriends = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/getFriends`, {
      method: 'GET',
      headers: { 'authToken': token }
    });
    const { friends } = await response.json();
    return friends;
  } catch (error) {
    console.error(error);
  }
};

const Chat = () => {
  const { socket } = useContext(UserContext);
  const { user, loading, doUpdateUser } = useAuthorization(user => user);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState(undefined);
  const [messages, setMessages] = useState(undefined);
  const [friends, setFriends] = useState(undefined);
  const [friendID, setFriendID] = useState(undefined);

  const handleMessageChange = e => setMessage(e.target.value);
  const handleAddFriend = async friendID => {
    socket.emit('addFriend', localStorage.getItem('token'), friendID, (friends) => setFriends(friends));
  };
  const handleRemoveFriend = async friendID => {
    socket.emit('removeFriend', localStorage.getItem('token'), friendID, (friends) => setFriends(friends));
  };
  const handleSendMessage = e => {
    e.preventDefault();
    if (message) {
      socket.emit('sendMessage', localStorage.getItem('token'), friendID, message, () => setMessage(''));
    }
  };
  const handleGetConversationMessages = async userID => {
    socket.emit('getConversationMessages', localStorage.getItem('token'), userID, (messages) => setMessages(messages));
  };
  const handleGetUseConversation = async () => {
    socket.emit('getUserConversations', localStorage.getItem('token'));
  };

  useEffect(() => {
    (async () => {
      if (!users) {
        try {
          const users = await getUsers();
          const friends = await getFriends();
          setFriends(friends);
          setUsers(users);
        } catch (error) {
          console.log(error)
        }
      }
    })()
  }, [users]);

  return !loading && user ? (
    <>
      <Messages messages={messages} />
      <input value={message} placeholder="message" onChange={handleMessageChange} onKeyPress={e => e.key === 'Enter' ? handleSendMessage(e) : null} />
      {users ? users.map(user => (
          <ul key={user._id}>
            <li onClick={() => setFriendID(user._id)}>{user.name}</li>
            {friends.includes(user._id) ? (
              <>
                <button type="submit" onClick={() => handleRemoveFriend(user._id)}>remove friend</button>
                <button type="submit" onClick={() => handleGetConversationMessages(user._id)}>get conversation</button>
              </>
            ) : (
              <button type="submit" onClick={() => handleAddFriend(user._id)}>add to friend</button>
            )}
          </ul>
        )
      ) : null}
      <LogoutButton updateFn={doUpdateUser} />
    </>
  ) : null;
};

export default Chat;
