import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Message from './Message';

const StyledWrapper = styled.div`
  padding: 10px;
  max-height: 500px;
  overflow: auto;
`;

const StyledMessage = styled.div``;

const Messages = ({ messages }) => {
  return (
    <StyledWrapper>
      {messages ? messages.map(message => {
        const author = message.author.name;
        const { content } = message;
        const rawDate = new Date(message.date);
        const date = `${rawDate.getHours()}:${rawDate.getMinutes()}`;
        return (
          <Message key={message._id} author={author} content={content} date={date} />
          // <StyledMessage key={message._id}>
          //   <p>{message.author.name}</p>
          //   <p>{message.content}</p>
          //   <p>{date.getHours()}:{date.getMinutes()}</p>
          // </StyledMessage>
        )
      }) : null}
    </StyledWrapper>
  )
};

export default Messages;

Messages.propTypes = {
  messages: PropTypes.array
};

Messages.defaultProps = {
  messages: undefined
};
