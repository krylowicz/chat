import React, { useState, useEffect, useContext } from 'react';
import UserContext, { useAuthorization } from 'context/userContext';
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

  const handleAddFriend = async () => {
    try {
      const userID = user._id;
      const friendID = '5e84a35a89c52d73f49f9fb6';
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/addFriend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authToken': localStorage.getItem('token')
        },
        body: JSON.stringify({ userID, friendID })
      });
      const json = await response.json();
      console.log(json.user);
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
      if (!users) {
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
      {users ? users.map(user => (
        <ul key={user._id}>
          <li>
            {user.name}
            <button type="submit" onClick={handleAddFriend}>add to friend</button>
          </li>
        </ul>
      )) : <p>loading</p>}
      <LogoutButton updateFn={doUpdateUser} />
    </>
  ) : null;
};

export default Chat;
