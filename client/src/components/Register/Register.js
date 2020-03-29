import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import UserContext from "context/userContext";

const StyledForm = styled.form``;

const StyledInput = styled.input``;

const StyledButton = styled.button``;

const Register = () => {
  const { handleAuth } = useContext(UserContext);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleNameChange = e => setName(e.target.value);
  const handlePasswordChange = e => setPassword(e.target.value);
  const handleFormSubmit = async e => {
    e.preventDefault();
    const error = await handleAuth('register', name, password);
    if (error) {
      setError(error);
    }
  };

  return (
    <StyledForm onSubmit={handleFormSubmit}>
      <StyledInput type="text" name="name" placeholder="name" onChange={handleNameChange} />
      <StyledInput type="password" name="password" placeholder="password" onChange={handlePasswordChange} />
      <StyledButton type="submit">register</StyledButton>
      { error ? <p>{error}</p> : null }
    </StyledForm>
  )
};

export default Register;
