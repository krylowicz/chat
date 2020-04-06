import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

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

const Conversations = ({ user, socket, setConversationID }) => {
  const [search, setSearch] = useState('');
  const [searchedValue, setSearchedValue] = useState('');
  const [users, setUsers] = useState(undefined);
  const [friends, setFriends] = useState(undefined);
  const [userConversations, setUserConversations] = useState(undefined);

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
      return users;
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddFriend = async friendID => {
    socket.emit('addFriend', localStorage.getItem('token'), friendID, (friends) => setFriends(friends));
  };
  const handleRemoveFriend = async friendID => {
    socket.emit('removeFriend', localStorage.getItem('token'), friendID, (friends) => setFriends(friends));
  };
  const handleGetUserConversation = async () => {
    socket.emit('getUserConversations', localStorage.getItem('token'), (conversation) => setUserConversations(conversation));
  };
  const handleSearchChange = e => setSearch(e.target.value);
  const handleSetUsers = async () => setUsers(await getUsers(search));

  useEffect(() => {
    if (search && searchedValue !== search) {
      const interval = setInterval(handleSetUsers, 500);
      return () => clearInterval(interval);
    }
  }, [search, searchedValue]);

  useEffect(() => {
    (async () => {
      if (!userConversations) {
        setUserConversations(await handleGetUserConversation());
      }
    })()
  }, [userConversations]);

  return (
    <>
      <input placeholder="search" onChange={handleSearchChange} />
      {search ? (
        <>
          {users ? users.map(otherUser => (
            <ul key={otherUser._id}>
              <li>{otherUser.name}</li>
              {otherUser.friends.includes(user._id) ? (
                <button type="submit" onClick={() => handleRemoveFriend(otherUser._id)}>remove friend</button>
              ) : (
                <button type="submit" onClick={() => handleAddFriend(otherUser._id)}>add to friend</button>
              )}
            </ul>
          )) : null}
        </>
      ) : (
        <>
          {userConversations ? userConversations.map(conversation => (
            <ul key={conversation._id}>
              <li>{conversation.users.map(otherUser => user._id !== otherUser._id ? otherUser.name : false).filter(name => name).join(', ')}</li>
            </ul>
          )) : null}
        </>
      )}
    </>
  );
};

export default Conversations;

Conversations.propTypes = {
  user: PropTypes.object.isRequired,
  socket: PropTypes.object.isRequired
};

