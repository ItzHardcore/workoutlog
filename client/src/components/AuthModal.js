// AuthModal.js
import React, { useState } from 'react';
import Login from './Login'; // Update the path based on your project structure
import Registration from './Register'; // Update the path based on your project structure

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  const handleSuccessfulAuth = (username) => {
    onLogin(username); // Call the onLogin function passed from the parent component
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: isOpen ? 'block' : 'none' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{isLogin ? 'Login' : 'Register'}</h5>
            <button type="button" className="close" onClick={onClose} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {isLogin ? (
              <Login onClose={onClose} onSuccessfulAuth={handleSuccessfulAuth} />
            ) : (
              <Registration onClose={onClose} onSuccessfulAuth={handleSuccessfulAuth} />
            )}
            <p>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <span className="auth-toggle" onClick={handleToggle}>
                {isLogin ? 'Register here' : 'Login here'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
