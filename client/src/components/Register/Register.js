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
    <StyledWrapper>
      <Form>
        <FormItem type="text" id="name" onChange={handleNameChange} />
        <FormItem type="password" id="password" onChange={handlePasswordChange} />
        <Button onClick={handleFormSubmit}>register</Button>
        { error ? <p>{error}</p> : null }
      </Form>
    </StyledWrapper>
  )
};

export default Register;
