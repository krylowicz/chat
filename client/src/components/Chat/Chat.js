import React, { useState, useEffect, useRef } from 'react';
import { useAuthorization } from 'context/userContext';
import LogoutButton from 'components/LogoutButton/LogoutButton';
import io from 'socket.io-client';

const Chat = () => {
  const socket = useRef(null);
  const { user, loading, doUpdateUser } = useAuthorization(user => user);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.current = io('http://localhost:5000');
  });

  const handleMessageChange = e => setMessage(e.target.value);
  const handleKeyPress = e => {
    e.preventDefault();
    if (message) {
      socket.current.emit('sendMessage', message, () => setMessage(''));
    }
  };
  console.log(loading, user);
  return !loading && user ? (
    <>
      <input value={message} placeholder="message" onChange={handleMessageChange} onKeyPress={e => e.key === 'Enter' ? handleKeyPress(e) : null} />
      <LogoutButton updateFn={doUpdateUser} />
    </>
  ) : null;
};

export default Chat;
