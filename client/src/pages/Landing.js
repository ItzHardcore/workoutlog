// Landing.js
import React, { useState } from 'react';
import AuthModal from '../components/AuthModal'; // Update the path based on your project structure
import Dashboard from './Dashboard';

const Landing = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogin = (username) => {
    setLoggedInUser(username);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <div>
      {loggedInUser ? (
        <div>
          <h1>Welcome, {loggedInUser}!</h1>
          <button onClick={handleLogout}>Logout</button>
          {/* Add your dashboard content here */}
        </div>
      ) : (
        <div>
          <h1>Welcome to the Landing Page!</h1>
          <button onClick={openAuthModal}>Login/Register</button>
          <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} onLogin={handleLogin} />
        </div>
      )}
    </div>
  );
};

export default Landing;
