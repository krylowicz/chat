import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledFormItem = styled.div`
  width: 100%;
  margin: 1.5rem 0;
  position: relative;
  flex-shrink: 0;
`;

const StyledInput = styled.input`
  color: ${({ theme }) => theme.color.light};
  font-size: 2.4rem;
  line-height: 2.2rem;
  height: 100%;
  border: none;
  background: none;
  width: 100%;

  &:focus {
    outline: none;
  }

  &:focus + label {
    top: -2.2rem;
    font-size: 1.8rem;
  }

  &:not(:placeholder-shown) + label {
    top: -2.2rem;
    font-size: 1.8rem;
  }
`;

const StyledLabel = styled.label`
  color: ${({ theme }) => theme.color.light};
  position: absolute;
  top: 3px;
  left: 0;
  transition: 0.2s ease-in-out;
  font-size: 2.4rem;
  pointer-events: none;
`;

const StyledBar = styled.div`
  width: 100%;
  height: 0.2rem;
  background: ${({ theme }) => theme.color.secondary};
  transition: all 0.1s;
`;

const FormItem = ({ id, type, onChange }) => (
  <StyledFormItem>
    <StyledInput id={id} type={type} placeholder=" " onChange={onChange} />
    <StyledLabel htmlFor={id}>{id}</StyledLabel>
    <StyledBar />
  </StyledFormItem>
);

export default FormItem;

FormItem.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};
