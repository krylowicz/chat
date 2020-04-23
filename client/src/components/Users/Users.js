import React, { useState, useEffect, useCallback, useContext } from 'react';
import UserContext from 'context/userContext';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledWrapper = styled.div`
  font-size: 1.8rem;
  width: 30%;
  padding: 1rem;
  border-right: 0.005rem solid ${({ theme }) => theme.color.light};
`;

const StyledSearch = styled.input`
  font-size: 1.8rem;
  width: 100%;
  background: none;
  border: 0;
  margin-bottom: 1.2rem;
  color: ${({ theme }) => theme.color.light};
  border-bottom: 0.2rem solid ${({ theme }) => theme.color.secondary};
  
  &::placeholder {
    color: inherit;
  }
`;

const StyledList = styled.ul`
  list-style: none;
  width: 100%;
  margin: 1.2rem 0;
  padding-left: 2rem;
  font-size: 2rem;
  
  li {
    cursor: pointer;  
    font-weight: ${({ theme, active }) => active ? theme.font.bold : theme.font.regular};
  }
`;

const StyledInfo = styled.p`
  text-align: center;
`;

// const getFriends = async () => {
//   const token = localStorage.getItem('token');
//   try {
//     const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/getFriends`, {
//       method: 'GET',
//       headers: { 'authToken': token }
//     });
//     const { friends } = await response.json();
//     return friends;
//   } catch (error) {
//     console.error(error);
//   }
// };

const Users = ({ user, socket, setConversationID, setMessages, conversationID }) => {
  const [search, setSearch] = useState('');
  const [searchedValue, setSearchedValue] = useState('');
  const [users, setUsers] = useState(undefined);
  const [userConversations, setUserConversations] = useState(undefined);
  const { updateFriends } = useContext(UserContext);

  const getUsers = async (search) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/getUsersWithSearch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authToken': localStorage.getItem('token')
        },
        body: JSON.stringify({ search })
      });
      setSearchedValue(search);
      const { users } = await response.json();
      console.log('siema', users);
      return users;
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetConversationMessages = (conversationID) => {
    socket.emit('getConversationMessages', localStorage.getItem('token'), conversationID, messages => setMessages(messages));
  };
  const handleGetUserConversation = useCallback(async () => {
    socket.emit('getUserConversations', localStorage.getItem('token'), conversations => {
      setUserConversations(conversations);

      if (conversations && conversations.length && !conversationID) {
        handleGetConversationMessages(conversations[0]._id);
        setConversationID(conversations[0]._id);
      }
    });
  }, [socket, setConversationID]);
  const handleAddFriend = friendID => {
    socket.emit('addFriend', localStorage.getItem('token'), friendID, async (conversationID) => {
      setConversationID(conversationID);
      setSearch('');
      await handleGetUserConversation();
      setSearchedValue('')
    });
  };
  const handleRemoveFriend = friendID => {
    socket.emit('removeFriend', localStorage.getItem('token'), friendID, async () => {
      setSearch('');
      await handleGetUserConversation();
      setSearchedValue('')
    });
  };
  const handleSearchChange = e => setSearch(e.target.value);
  const handleSetUsers = useCallback(async () => setUsers(await getUsers(search)), [search]);

  useEffect(() => {
    if (search && searchedValue !== search) {
      const interval = setInterval(handleSetUsers, 500);
      return () => clearInterval(interval);
    }
  }, [search, searchedValue, handleSetUsers]);

  useEffect(() => {
    (async () => {
      if (!userConversations) {
        setUserConversations(await handleGetUserConversation());
      }
    })()
  }, [userConversations, socket, handleGetUserConversation]);

  return (
    <StyledWrapper>
      <StyledSearch value={search} placeholder="search" onChange={handleSearchChange} />
      {search ? (
        <>
          {users ? users.map(otherUser => (
            <StyledList key={otherUser._id}>
              <li>{otherUser.name}</li>
              {otherUser.friends.includes(user._id) ? (
                <button type="submit" onClick={() => handleRemoveFriend(otherUser._id)}>remove friend</button>
              ) : (
                <button type="submit" onClick={() => handleAddFriend(otherUser._id)}>add to friend</button>
              )}
            </StyledList>
          )) : <StyledInfo>couldn't find anyone</StyledInfo>}
        </>
      ) : (
        <>
          {userConversations ? userConversations.map(conversation => (
            <StyledList key={conversation._id} active={conversation._id === conversationID}>
              <li onClick={() => {
                setConversationID(conversation._id);
                handleGetConversationMessages(conversation._id);
              }}>
                {conversation.users.map(otherUser => user._id !== otherUser._id ? otherUser.name : false).filter(name => name).join(', ')}
              </li>
            </StyledList>
          )) : null}
        </>
      )}
    </StyledWrapper>
  );
};

export default Users;

Users.propTypes = {
  user: PropTypes.object.isRequired,
  socket: PropTypes.object.isRequired,
  setConversationID: PropTypes.func.isRequired,
  setMessages: PropTypes.func.isRequired,
  conversationID: PropTypes.string.isRequired
};
