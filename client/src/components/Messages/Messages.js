import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Message from './Message';

const StyledWrapper = styled.div`
  padding: 1rem;
  overflow: auto;
  width: 70%;
  position: relative;
`;

const StyledInput = styled.input`
  width: 100%;
  position: fixed;
  bottom: 0;
  padding: 1rem;
  font-size: 2rem;
  border: 0;
  background: ${({ theme }) => theme.color.light};
  color: ${({ theme }) => theme.color.primary};
  transform: translateX(-1rem);
  outline: none;
`;

const StyledInnerWrapper = styled.div`
  margin-bottom: 4rem;
`;

const Messages = ({ messages, onChange, onKeyPress, value }) => {
  return (
    <StyledWrapper>
      <StyledInnerWrapper>
        {messages ? messages.map(message => {
          const author = message.author.name;
          const { content } = message;
          const rawDate = new Date(message.date);
          const date = `${rawDate.getHours()}:${rawDate.getMinutes()}`;
          return <Message key={message._id} author={author} content={content} date={date} />
        }) : null}
      </StyledInnerWrapper>
      <StyledInput value={value} onChange={onChange} onKeyPress={onKeyPress} />
    </StyledWrapper>
  )
};

export default Messages;

Messages.propTypes = {
  messages: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};

Messages.defaultProps = {
  messages: undefined
};
