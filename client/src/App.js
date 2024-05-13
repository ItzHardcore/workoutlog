import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './components/Routes';
import Footer from './components/Footer';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    //Retrieve the dark mode state from localStorage, or default to false if not found
    const savedMode = JSON.parse(localStorage.getItem('isDarkMode'));
    return savedMode !== null ? savedMode : false;
  });

  useEffect(() => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }, [token, user]);

  const handleLogin = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const handleRegister = (message) => {
    console.log(message);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      //Save the new dark mode state in localStorage
      localStorage.setItem('isDarkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  useEffect(() => {
    //Update HTML attribute based on dark mode state
    document.querySelector('html').setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <Router>
      <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
        {/* Pass dark mode state and toggle function to Navbar */}
        <Navbar token={token} user={user} handleLogout={handleLogout} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
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
