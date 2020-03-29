import React, { useEffect } from 'react';
import io from 'socket.io-client';
import Register from "./components/Register/Register";

let socket;

const Root = () => {
  useEffect(() => {
    socket = io('http://localhost:5000')
  });

  return (
    <Register />
  )
};

export default Root;
