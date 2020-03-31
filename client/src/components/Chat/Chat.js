import React, { useState, useContext } from 'react';
import UserContext, { useAuthorization } from 'context/userContext';
import LogoutButton from 'components/LogoutButton/LogoutButton';

const Chat = () => {
  const { socket } = useContext(UserContext);
  const { user, loading, doUpdateUser } = useAuthorization(user => user);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleMessageChange = e => setMessage(e.target.value);
  const handleKeyPress = e => {
    e.preventDefault();
    if (message) {
      socket.emit('sendMessage', user._id, message, () => setMessage(''));
    }
  };

  const getMessages = async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getMessages`);
    const { test } = await response.json();
    console.log(test);
  };

  return !loading && user ? (
    <>
      <input value={message} placeholder="message" onChange={handleMessageChange} onKeyPress={e => e.key === 'Enter' ? handleKeyPress(e) : null} />
      <LogoutButton updateFn={doUpdateUser} />
    </>
  ) : null;
};

export default Chat;
