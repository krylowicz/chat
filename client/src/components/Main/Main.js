import React, { useEffect } from 'react';
import LogoutButton from "../LogoutButton/LogoutButton";

const Main = () => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);
  });

  return (
    <LogoutButton/>
  )
};

export default Main;
