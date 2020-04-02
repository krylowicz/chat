import React, { useState, useEffect, useContext } from 'react';
import UserContext, { useAuthorization } from 'context/userContext';
import { getUsers } from 'utils/apiMethods';
import LogoutButton from 'components/LogoutButton/LogoutButton';

const Chat = () => {
  const { socket } = useContext(UserContext);
  const { user, loading, doUpdateUser } = useAuthorization(user => user);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState(undefined);

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
            <button type="submit" onClick={() => handleAddFriend(user._id)}>add to friend</button>
          </li>
        </ul>
      )) : <p>loading</p>}
      <LogoutButton updateFn={doUpdateUser} />
    </>
  ) : null;
};

export default Chat;
