import React, { useState, useEffect, useContext } from 'react';
import UserContext, { useAuthorization } from 'context/userContext';
import { getUsers, getFriends } from 'utils/apiMethods';
import LogoutButton from 'components/LogoutButton/LogoutButton';

const Chat = () => {
  const { socket } = useContext(UserContext);
  const { user, loading, doUpdateUser } = useAuthorization(user => user);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState(undefined);
  const [friends, setFriends] = useState(undefined);

  const handleMessageChange = e => setMessage(e.target.value);
  const handleKeyPress = e => {
    e.preventDefault();
    if (message) {
      socket.emit('sendMessage', user._id, message, () => setMessage(''));
    }
  };
  const handleAddFriend = async friendID => {
    socket.emit('addFriend', localStorage.getItem('token'), friendID, (friends) => setFriends(friends));
  };

  const handleRemoveFriend = async friendID => {
    try {
      await fetch(`${process.env.REACT_APP_BASE_URL}/users/removeFriend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authToken': localStorage.getItem('token')
        },
        body: JSON.stringify({ friendID })
      });
    } catch (error) {
      console.error(error);
    }
  };

  const createConversation = async userID => {
    const token = localStorage.getItem('token');
    try {
      const currentUserID = user._id;
      await fetch(`${process.env.REACT_APP_BASE_URL}/messages/createConversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authToken': token
        },
        body: JSON.stringify({ currentUserID, userID })
      });
    } catch (error) {
      console.error(error);
    }
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
      <input value={message} placeholder="message" onChange={handleMessageChange} onKeyPress={e => e.key === 'Enter' ? handleKeyPress(e) : null} />
      {users ? users.map(user => (
          <ul key={user._id}>
            <li>{user.name}</li>
            {friends.includes(user._id) ? (
              <>
                <button type="submit" onClick={() => handleRemoveFriend(user._id)}>remove friend</button>
                <button type="submit" onClick={() => createConversation(user._id)}>create conversation</button>
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
