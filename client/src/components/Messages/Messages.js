import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  background: pink;
  padding: 10px;
`;

const Messages = ({ messages }) => (
  <StyledWrapper>
    {messages ? messages.map(message => {
      return (
        <div key={message._id}>
          <p>{message.author}</p>
          <p>{message.content}</p>
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
