import React from 'react';
import { useHistory } from 'react-router-dom';

const LogoutButton = ({ updateFn }) => {
  const history = useHistory();

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      await localStorage.removeItem('token');
      updateFn();
      history.push('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button type="submit" onClick={handleSubmit}>logout</button>
  )
};

export default LogoutButton;
