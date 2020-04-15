import React, { useContext } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import UserContext from 'context/userContext';

const StyledWrapper = styled.div`
  font-size: 1.8rem;
  display: flex;
  flex-direction: row;
`;

const StyledMessageWrapper = styled.div`
  max-width: 30rem;
  word-wrap: break-spaces;
  width: auto;
  position: relative;
  display: flex;
  flex-direction: row;
  background: ${({ light, theme }) => light ? theme.color.light : theme.color.secondary};
  color: ${({ light, theme }) => light ? theme.color.primary: theme.color.primary};
  justify-content: ${({ light }) => light ? 'flex-end' : 'flex-start'};
  margin: ${({ light }) => light ? '2rem 1.2rem 2rem auto' : '2rem 0'};
  text-align: left;
  align-items: flex-end;
  padding: 0.6rem 0.8rem;
  border-radius: 0.8rem;
`;

const StyledHour = styled.p`
  margin: 0;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.color.primary};
`;

const StyledContent = styled.p`
  margin: 0 0.5rem 0 0;
`;

const StyledAuthor = styled.p`
  position: absolute;
  color: ${({ theme }) => theme.color.light};
  margin: 0;
  font-size: 1.2rem;
  top: -1.6em;
`;

const Message = ({ author, content, date }) => {
  const { user } = useContext(UserContext);

  return user.name === author ? (
    <StyledWrapper>
      <StyledMessageWrapper light>
        <StyledAuthor>{author}</StyledAuthor>
        <StyledContent>{content}</StyledContent>
        <StyledHour light>{date}</StyledHour>
      </StyledMessageWrapper>
    </StyledWrapper>
  ) : (
    <StyledWrapper>
      <StyledMessageWrapper>
        <StyledAuthor>{author}</StyledAuthor>
        <StyledContent>{content}</StyledContent>
        <StyledHour>{date}</StyledHour>
      </StyledMessageWrapper>
    </StyledWrapper>
  )
};

export default Message;

Message.propTypes = {
  author: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired
};
