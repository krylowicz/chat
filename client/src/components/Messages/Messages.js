import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  background: pink;
  padding: 10px;
  max-height: 500px;
  overflow: scroll;
`;

const Messages = ({ messages }) => (
  <StyledWrapper>
    {messages ? messages.map(message => {
      const date = new Date(message.date);
      return (
        <div key={message._id}>
          <p>{message.author.name}</p>
          <p>{message.content}</p>
          <p>{date.getHours()}:{date.getMinutes()}</p>
        </div>
      )
    }) : null}
  </StyledWrapper>
);

export default Messages;

Messages.propTypes = {
  messages: PropTypes.array
};

Messages.defaultProps = {
  messages: undefined
};
