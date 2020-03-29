import React from 'react';
import { useHistory } from 'react-router-dom';

const LogoutButton = () => {
  const history = useHistory();

  const handleLogout = async e => {
    try {
      e.preventDefault();
      await localStorage.removeItem('token');
      history.push('/');
      console.log(localStorage.getItem('token'));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleLogout}>
      <h1>you are logged in!</h1>
      <button type="submit">logout</button>
    </form>
  )
};

export default LogoutButton;
