import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledForm = styled.div`
  width: 30rem;
  display: flex;
  flex-direction: column;
  padding: 3rem;
`;

const Form = ({ children }) => (
  <StyledForm>
    {children}
  </StyledForm>
);

export default Form;

Form.propTypes = {
  children: PropTypes.array.isRequired,
};
