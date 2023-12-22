import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './components/Routes';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  const handleRegister = (message) => {
    console.log(message);
  };

  return (
    <Router>
      <div>
        <Navbar token={token} handleLogout={handleLogout} />
        <div className="container mt-3">
          <AppRoutes
            token={token}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
            handleRegister={handleRegister}
          />
        </div>
      </div>
    </Router>
  );
};

export default App;
