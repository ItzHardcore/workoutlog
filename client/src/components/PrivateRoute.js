// components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ token, component: Component, ...rest }) => {
  return token ? <Component token={token} {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
