import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

const StyledButton = styled.button`
  position: absolute;
  left: 1rem;
  bottom: 1rem;
  border: none;
  background: none;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.color.paragraph};
  cursor: pointer;
`;

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
    <StyledButton type="submit" onClick={handleSubmit}>logout</StyledButton>
  )
};

export default LogoutButton;

LogoutButton.propTypes = {
  updateFn: PropTypes.func.isRequired
};
