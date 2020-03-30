import React, { useState, useEffect, useContext, useRef } from 'react';
import UserContext, { useAuthorization } from 'context/userContext';
import LogoutButton from 'components/LogoutButton/LogoutButton';
import io from 'socket.io-client';

const Chat = () => {
  const socket = useRef(null);
  const { doUpdateUser } = useContext(UserContext);
  const { user, loading } = useAuthorization(user => user);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.current = io('http://localhost:5000');
  });

  useEffect(() => {
    doUpdateUser();
  });

  const handleMessageChange = e => setMessage(e.target.value);
  const handleKeyPress = e => {
    e.preventDefault();
    if (message) {
      socket.current.emit('sendMessage', message, () => setMessage(''));
    }
  };

  return !loading && user ? (
    <>
      <input value={message} placeholder="message" onChange={handleMessageChange} onKeyPress={e => e.key === 'Enter' ? handleKeyPress(e) : null} />
      <LogoutButton />
    </>
  ) : null;
};

export default Chat;
