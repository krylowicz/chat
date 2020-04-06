import React, { useState, useEffect, useContext } from 'react';
import UserContext, { useAuthorization } from 'context/userContext';
import LogoutButton from 'components/LogoutButton/LogoutButton';
import Messages from 'components/Messages/Messages';
import Conversations from 'components/Conversations/Conversations';

const Chat = () => {
  const { socket } = useContext(UserContext);
  const { user, loading, doUpdateUser } = useAuthorization(user => user);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(undefined);
  const [conversationID, setConversationID] = useState(undefined);

  const handleMessageChange = e => setMessage(e.target.value);
  const handleSendMessage = e => {
    e.preventDefault();
    if (message) {
      socket.emit('sendMessage', localStorage.getItem('token'), conversationID, message, () => setMessage(''));
    }
  };
  const handleGetConversationMessages = async userID => {
    socket.emit('getConversationMessages', localStorage.getItem('token'), userID, (messages) => setMessages(messages));
  };

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
      <Conversations user={user} socket={socket} setConversationID={setConversationID} />
      <LogoutButton updateFn={doUpdateUser} />
    </>
  ) : null;
};

export default Chat;
