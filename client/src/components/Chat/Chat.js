import React, { useState, useEffect, useContext } from 'react';
import UserContext, { useAuthorization } from 'context/userContext';
import LogoutButton from 'components/LogoutButton/LogoutButton';

const Chat = () => {
  const { socket } = useContext(UserContext);
  const { user, loading, doUpdateUser } = useAuthorization(user => user);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);

  const handleMessageChange = e => setMessage(e.target.value);
  const handleKeyPress = e => {
    e.preventDefault();
    if (message) {
      socket.emit('sendMessage', user._id, message, () => setMessage(''));
    }
  };

  const getUsers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/getUsers`);
      const { users } = await response.json();
      return users;
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddFriend = async () => {
    try {
      const userID = '5e84a34a89c52d73f49f9fb5';
      const friendID = '5e84a35a89c52d73f49f9fb6';
      await fetch(`${process.env.REACT_APP_BASE_URL}/users/addFriend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID, friendID })
      })
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
      setFriends(friends);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      if (users.length === 0) {
        try {
          const users = await getUsers();
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
      {users.map(user => (
        <ul key={user._id}>
          <li>
            {user.name}
            <button type="submit" onClick={handleAddFriend}>add to friend</button>
          </li>
        </ul>
      ))}
      <LogoutButton updateFn={doUpdateUser} />
    </>
  ) : null;
};

export default Chat;
