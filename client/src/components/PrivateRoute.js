// components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ token, component: Component, username, ...rest }) => {
  return token ? <Component username={username} {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
