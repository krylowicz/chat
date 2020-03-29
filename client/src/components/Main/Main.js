import React from 'react';
import LogoutButton from "../LogoutButton/LogoutButton";
import { useAuthorization } from "context/userContext";

const Main = () => {
  const { user, loading } = useAuthorization(user => user);

  return !loading && user ? <LogoutButton/> : null;
};

export default Main;
