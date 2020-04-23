import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import UserContext, { useAuthorization } from 'context/userContext';
import LogoutButton from 'components/LogoutButton/LogoutButton';
import Messages from 'components/Messages/Messages';
import Users from 'components/Users/Users';

const StyledWrapper = styled.div`
  background: ${({ theme }) => theme.color.primary};
  color: ${({ theme }) => theme.color.light};
  width: 100vw;
  height: 100vh;
  display: flex;
  position: relative;
`;

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
    <StyledWrapper>
      <Users user={user} socket={socket} setConversationID={setConversationID} setMessages={setMessages} conversationID={conversationID} />
      <Messages messages={messages} value={message} onChange={handleMessageChange} onKeyPress={e => e.key === 'Enter' ? handleSendMessage(e) : null} />
      <LogoutButton updateFn={doUpdateUser} />
    </StyledWrapper>
  ) : null;
};

export default Chat;
