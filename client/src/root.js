import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { UserContextProvider } from 'context/userContext';
import Login from 'components/Login/Login';
import Register from 'components/Register/Register';
import Chat from 'components/Chat/Chat';

const Root = () => {
  return (
    <Router>
      <UserContextProvider>
        <Switch>
          <Route exact path="/" component={Chat} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
        </Switch>
      </UserContextProvider>
    </Router>
  );
};

export default Root;
