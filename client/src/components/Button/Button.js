import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledButton = styled.button`
  border: 0;
  color: ${({ theme }) => theme.color.light};
  background: ${({ theme }) => theme.color.secondary};
  width: 100%;
  margin-top: 1.5rem;
  padding: 1.2rem 0;
  border-radius: 0.8rem;
  font-size: 2.4rem;
`;

const Button = ({ children, onClick }) => (
  <StyledButton onClick={onClick}>{children}</StyledButton>
);

export default Button;

Button.propTypes = {
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};
