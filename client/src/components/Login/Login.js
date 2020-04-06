import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import UserContext from "context/userContext";

const StyledForm = styled.form``;

const StyledInput = styled.input``;

const StyledButton = styled.button``;

const Login = () => {
  const { handleAuth } = useContext(UserContext);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleNameChange = e => setName(e.target.value);
  const handlePasswordChange = e => setPassword(e.target.value);
  const handleSubmit = async e => {
    e.preventDefault();
    const error = await handleAuth('login', name, password);
    if (error) {
      setError(error);
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledInput type="text" name="name" placeholder="name" onChange={handleNameChange} />
      <StyledInput type="password" name="password" placeholder="password" onChange={handlePasswordChange} />
      <StyledButton type="submit">login</StyledButton>
      { error ? <p>{error}</p> : null }
    </StyledForm>
  )
};

export default Login;
