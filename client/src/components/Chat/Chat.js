import React, { useState, useEffect, useContext } from 'react';
import UserContext, { useAuthorization } from 'context/userContext';
import LogoutButton from 'components/LogoutButton/LogoutButton';
import Messages from 'components/Messages/Messages';
import Users from 'components/Users/Users';

const Chat = () => {
  const { socket } = useContext(UserContext);
  const { user, loading, doUpdateUser } = useAuthorization(user => user);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversationID, setConversationID] = useState(undefined);

  const handleMessageChange = e => setMessage(e.target.value);
  const handleSendMessage = e => {
    e.preventDefault();
    if (message && conversationID) {
      socket.emit('sendMessage', localStorage.getItem('token'), conversationID, message, () => setMessage(''));
    }
  };

  useEffect(() => {
    if (localStorage.getItem('conversationID') !== conversationID) {
      localStorage.setItem('conversationID', conversationID);
    }
  }, [conversationID]);

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', message => setMessages(prevState => [...prevState, message]));
      return () => socket.removeAllListeners('newMessage');
    }
  }, [socket]);

  return !loading && user && socket ? (
    <>
      <Messages messages={messages} />
      <input value={message} placeholder="message" onChange={handleMessageChange} onKeyPress={e => e.key === 'Enter' ? handleSendMessage(e) : null} />
      <Users user={user} socket={socket} setConversationID={setConversationID} setMessages={setMessages} />
      <LogoutButton updateFn={doUpdateUser} />
    </>
  ) : null;
};

export default Chat;
