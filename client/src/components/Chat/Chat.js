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
  let currentUserID;
  if (user) currentUserID = user._id;

  const handleMessageChange = e => setMessage(e.target.value);
  const handleKeyPress = e => {
    e.preventDefault();
    if (message) {
      socket.emit('sendMessage', user._id, message, () => setMessage(''));
    }
  };
  const handleAddFriend = async friendID => {
    try {
      const userID = user._id;
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/addFriend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authToken': localStorage.getItem('token')
        },
        body: JSON.stringify({ userID, friendID })
      });
      return await response.json();
    } catch (error) {
      console.error(error);
    }
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
      {users ? users.map(user => {
        const commonFriends = user.friends.map(({ _id }) => _id);

        return (
          <ul key={user._id}>
            <li>{user.name}</li>
            {commonFriends.includes(currentUserID) ? (
              //currentUser.friends.findIndex(friend => friend._id === user._id) zwraca -1 check
              <>
                <button type="submit" onClick={() => handleRemoveFriend(user._id)}>remove friend</button>
                <button type="submit" onClick={() => createConversation(user._id)}>create conversation</button>
              </>
            ) : (
              <button type="submit" onClick={() => handleAddFriend(user._id)}>add to friend</button>
            )}
          </ul>
        )
      }) : null}
      <LogoutButton updateFn={doUpdateUser} />
    </>
  ) : null;
};

export default Chat;
