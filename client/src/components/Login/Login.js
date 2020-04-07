import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import UserContext from "context/userContext";
import Form from 'components/Form/Form';
import FormItem from 'components/FormItem/FormItem';
import Button from 'components/Button/Button';

const StyledWrapper = styled.div`
  background: ${({ theme }) => theme.color.primary};
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

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
    <StyledWrapper>
      <Form>
        <FormItem id="name" type="text" onChange={handleNameChange} />
        <FormItem id="password" type="password" onChange={handlePasswordChange} />
        <Button onClick={handleSubmit}>login</Button>
      </Form>
      { error ? <p>{error}</p> : null }
    </StyledWrapper>
  )
};

export default Login;
