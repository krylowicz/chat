import React, { createContext, useContext, useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types';
import io from 'socket.io-client';

const UserContext = createContext(null);

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const history = useHistory();
  const [socket, setSocket] = useState(undefined);

  const handleAuth = async (authType, name, password, callback) => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/${authType}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password }),
    });
    const { user, token, error } = await response.json();
    if (error) {
      callback(error);
    } else {
      setUser({...user});
      localStorage.setItem('token', token);
      history.push('/');
    }
  };

  const doUpdateUser = () => setUser(undefined);

  useEffect(() => {
    if (!socket) setSocket(io('http://localhost:5000'));
  }, [socket]);

  useEffect( () => {
    (async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setUser(null)
      } else if (user === undefined) {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/whoami`, {
          method: 'GET',
          headers: { 'authToken': token }
        });
        const { user, error } = await response.json();
        if (error) {
          console.error(error);
        } else {
          setUser(user);
        }
      }
    })();
  }, [user]);

  return (
    <UserContext.Provider value={{ user, doUpdateUser, handleAuth, socket }}>
      {children}
    </UserContext.Provider>
  );
};

UserContextProvider.propTypes = {
  children: PropTypes.array.isRequired,
};

const useAuthorization = condition => {
  const { user, doUpdateUser } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    if (user !== undefined) {
      if(!condition(user)) {
        history.push('/login');
      }
    }
  }, [user, condition, history]);

  return { user, loading: user === undefined, error: user === null, doUpdateUser };
};

useAuthorization.propTypes = {
  condition: PropTypes.func.isRequired
};

export default UserContext;
export { UserContextProvider, useAuthorization };
