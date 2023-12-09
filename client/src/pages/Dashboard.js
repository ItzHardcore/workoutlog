// pages/Dashboard.js
import React from 'react';

function Dashboard({ token, handleLogout }) {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to the dashboard, {token}!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
