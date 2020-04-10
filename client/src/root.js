import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { UserContextProvider } from 'context/userContext';
import GlobalStyle from 'theme/globalStyle';
import { theme } from 'theme/mainTheme';
import Login from 'components/Login/Login';
import Register from 'components/Register/Register';
import Chat from 'components/Chat/Chat';
import Helmet from 'utils/Helmet';

const Root = () => {
  return (
    <Router>
      <UserContextProvider>
        <Helmet />
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Switch>
            <Route exact path="/" component={Chat} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
          </Switch>
        </ThemeProvider>
      </UserContextProvider>
    </Router>
  );
};

export default Root;
