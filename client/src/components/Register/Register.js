import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import useFormHandle from "../../hooks/useFormHandle";

const StyledForm = styled.form``;

const StyledInput = styled.input``;

const StyledButton = styled.button``;

const Register = () => {
  const { handleNameChange, handlePasswordChange, handleFormSubmit } = useFormHandle('register');

  return (
    <StyledForm onSubmit={handleFormSubmit}>
      <StyledInput type="text" name="name" placeholder="name" onChange={handleNameChange} />
      <StyledInput type="password" name="password" placeholder="password" onChange={handlePasswordChange} />
      <StyledButton type="submit">register</StyledButton>
    </StyledForm>
  )
};

export default Register;
