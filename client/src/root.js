import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import io from 'socket.io-client';
import { UserContextProvider } from "context/userContext";
import Login from 'components/Login/Login';
import Register from 'components/Register/Register';
import Main from "components/Main/Main";

const Root = () => {
  useEffect(() => {
    io('http://localhost:5000')
  });

  return (
    <Router>
      <UserContextProvider>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
        </Switch>
      </UserContextProvider>
    </Router>
  )
};

export default Root;
