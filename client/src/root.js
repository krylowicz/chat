import React, { useEffect } from 'react';
import io from 'socket.io-client';

let socket;

const Root = () => {
  useEffect(() => {
    socket = io('http://localhost:5000')
  });

  return (
    <h1>hello world</h1>
  )
};

export default Root;
