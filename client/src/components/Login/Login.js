import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from "react-router-dom";

const StyledForm = styled.form``;

const StyledInput = styled.input``;

const StyledButton = styled.button``;

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleNameChange = e => setName(e.target.value);
  const handlePasswordChange = e => setPassword(e.target.value);
  const handleFormSubmit = async e => {
    e.preventDefault();
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password }),
    });
    const { token } = await response.json();
    localStorage.setItem('token', token);
    history.push('/main');
  };

  return (
    <StyledForm onSubmit={handleFormSubmit}>
      <StyledInput type="text" name="name" placeholder="name" onChange={handleNameChange} />
      <StyledInput type="password" name="password" placeholder="password" onChange={handlePasswordChange} />
      <StyledButton type="submit">login</StyledButton>
    </StyledForm>
  )
};

export default Login;
