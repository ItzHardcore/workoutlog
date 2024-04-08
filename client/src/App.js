import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './components/Routes';
import Footer from './components/Footer';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  useEffect(() => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user)); // stringify the user object
  }, [token, user]);

  const handleLogin = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    setToken('');
    setUser(null); // Clear the user object on logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const handleRegister = (message) => {
    console.log(message);
  };

  return (
    <Router>
      <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
        <Navbar token={token} user={user} handleLogout={handleLogout} />
        <div className="container flex-grow-1 mb-5">
          <AppRoutes
            token={token}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
            handleRegister={handleRegister}
          />
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
