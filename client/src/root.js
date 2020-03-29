import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import io from 'socket.io-client';
import Login from 'components/Login/Login';
import Register from 'components/Register/Register';
import Main from "components/Main/Main";

let socket;

const Root = () => {
  useEffect(() => {
    socket = io('http://localhost:5000');
  });

  return (
    <Router>
      <Route exact path="/" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/main" component={Main} />
    </Router>
  )
};

export default Root;
