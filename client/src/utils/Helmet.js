import React from 'react';
import { Helmet as ReactHelmet, HelmetProvider } from 'react-helmet-async';

const Helmet = () => (
  <HelmetProvider>
    <ReactHelmet>
      <title>chat app</title>
      <link rel="stylesheet" href="https://use.typekit.net/zei8qhj.css" />
    </ReactHelmet>
  </HelmetProvider>
);

export default Helmet;
