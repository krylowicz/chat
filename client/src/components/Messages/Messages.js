import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from './Message';

const StyledWrapper = styled(ScrollToBottom)`
  padding: 0 0 1rem 1rem;
  overflow-y: scroll;
  width: 70%;
  position: relative;
  z-index: 2;

  &::-webkit-scrollbar {
    display: none;
  }
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
  z-index: 3;
`;

const StyledInnerWrapper = styled.div`
  margin-bottom: 4rem;
  
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 0.6rem rgba(0,0,0,0.3);
    border-radius: 1rem;
    background-color: #F5F5F5;
  }

  &::-webkit-scrollbar {
    width: 0.8rem;
    background-color: #f5f5f5;
    display: none;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 1rem;
    background-color: ${({ theme }) => theme.color.secondary};
  }
`;

const Messages = ({ messages, onChange, onKeyPress, value }) => {
  return (
    <StyledWrapper>
      <StyledInnerWrapper>
        {messages ? messages.map(message => {
          const author = message.author.name;
          const { content } = message;
          const rawDate = new Date(message.date);
          let minutes = rawDate.getMinutes();
          const hours = rawDate.getHours();
          if (minutes < 10) minutes = `0${minutes}`;
          const date = `${hours}:${minutes}`;
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
