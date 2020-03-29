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
    const { token, error } = await response.json();
    if (error) {
      return error;
    } else {
      localStorage.setItem('token', token);
      history.push('/');
    }
  };

  const doUpdateToken = () => setUser(undefined);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) setUser(null);
  }, [user]);

  return(
    <UserContext.Provider value={{ user, doUpdateToken, handleAuth }}>
      {children}
    </UserContext.Provider>
  );
};

UserContextProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

const useAuthorization = condition => {
  const { user } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    if (user !== undefined) {
      if(!condition(user)) {
        history.push('/login');
      }
    }
  }, [user, condition, history]);

  return { user, loading: user === undefined, error: user === null };
};

useAuthorization.propTypes = {
  condition: PropTypes.func.isRequired
};

export default UserContext;
export { UserContextProvider, useAuthorization };
