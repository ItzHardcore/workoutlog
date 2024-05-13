import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ token, component: Component, ...rest }) => {
  useEffect(() => {
    const checkTokenExpiration = () => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;//Convert to seconds

          if (decodedToken.exp < currentTime) {
            //Token is expired, trigger logout and navigate to login
            //You can dispatch a logout action here if you're using Redux or setToken(null) if using state
            localStorage.removeItem('token');
            alert("Session ended! Login again");
            window.location.href = '/login';//Redirect to login page
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          //Handle the error (e.g., token is not valid)
        }
      }
    };

    checkTokenExpiration();
  }, [token]);

  return token ? <Component token={token} {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
