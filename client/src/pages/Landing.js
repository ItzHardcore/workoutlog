// pages/Landing.js
import React from 'react';

function Landing({ token, handleLogout }) {
  return (
    <div>
      <h2>Landing</h2>
      {token ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <p>Welcome to the landing page. Please log in or register.</p>
      )}
    </div>
  );
}

export default Landing;
