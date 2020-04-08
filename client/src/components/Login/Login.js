import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
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
  position: relative;
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.color.light};
  font-size: 1.4rem;
  margin: 0.4rem auto 0 auto;
  text-decoration: none;
`;

const StyledGithubLink = styled.a`
  color: ${({ theme }) => theme.color.paragraph};
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  font-size: 1.2rem;
  text-decoration: none;
`;

const Login = () => {
  const { handleAuth } = useContext(UserContext);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleNameChange = e => setName(e.target.value);
  const handlePasswordChange = e => setPassword(e.target.value);
  const handleFormSubmit = async e => {
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
        <Button onClick={handleFormSubmit}>login</Button>
        <StyledLink to="/register">dont have an account? click here</StyledLink>
      </Form>
      { error ? <p>{error}</p> : null }
      <StyledGithubLink target="_blank" href="https://github.com/krylowicz/chat">github</StyledGithubLink>
    </StyledWrapper>
  )
};

export default Login;
