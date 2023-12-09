// pages/Dashboard.js
import React from 'react';

function Dashboard({ token, username, handleLogout }) {
    console.log(token);
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to the dashboard, {username}!</p>
      <p>U have token: {token}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
