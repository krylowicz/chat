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

const StyledError = styled.p`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.color.light };
  margin: 0.5rem auto 0 auto;
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
    await handleAuth('login', name, password, setError);
  };

  return (
    <StyledWrapper>
      <Form>
        <FormItem id="name" type="text" onChange={handleNameChange} />
        <FormItem id="password" type="password" onChange={handlePasswordChange} />
        <Button onClick={handleFormSubmit}>login</Button>
        <StyledLink to="/register">dont have an account? click here</StyledLink>
        { error ? <StyledError>{error}</StyledError> : null }
      </Form>
      <StyledGithubLink target="_blank" href="https://github.com/krylowicz/chat">github</StyledGithubLink>
    </StyledWrapper>
  )
};

export default Login;
