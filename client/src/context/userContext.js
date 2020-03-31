import React, { createContext, useContext, useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types';

const UserContext = createContext(null);

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const history = useHistory();

  const handleAuth = async (authType, name, password) => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${authType}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password }),
    });
    const { user, token, error } = await response.json();
    if (error) {
      console.error(error);
    } else {
      setUser(user);
      localStorage.setItem('token', token);
      history.push('/');
    }
  };

  const doUpdateUser = () => setUser(undefined);

  useEffect( () => {
    (async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setUser(null)
      } else if (user === undefined) {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/whoami`, {
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

  return(
    <UserContext.Provider value={{ user, doUpdateUser, handleAuth }}>
      {children}
    </UserContext.Provider>
  );
};

UserContextProvider.propTypes = {
  children: PropTypes.object.isRequired,
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
