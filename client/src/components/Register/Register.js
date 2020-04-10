import React, { useContext, useState } from 'react';
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

const Register = () => {
  const { handleAuth } = useContext(UserContext);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleNameChange = e => setName(e.target.value);
  const handlePasswordChange = e => setPassword(e.target.value);
  const handleFormSubmit = async e => {
    e.preventDefault();
    await handleAuth('register', name, password, setError);
  };

  return (
    <StyledWrapper>
      <Form>
        <FormItem type="text" id="name" onChange={handleNameChange} />
        <FormItem type="password" id="password" onChange={handlePasswordChange} />
        <Button onClick={handleFormSubmit}>register</Button>
        { error ? <StyledError>{error}</StyledError> : null }
        <StyledGithubLink target="_blank" href="https://github.com/krylowicz/chat">github</StyledGithubLink>
      </Form>
    </StyledWrapper>
  )
};

export default Register;
