import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Register from './components/Register';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import EditWorkout from './pages/EditWorkout';

const App = () => {
  // Initialize token from localStorage if it exists
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    // Save token to localStorage when it changes
    localStorage.setItem('token', token);
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    // Use Navigate to redirect after login
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  const handleRegister = (message) => {
    console.log(message);
    // Use Navigate to redirect after registration
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Landing</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route
            path="/"
            element={<Landing token={token} handleLogout={handleLogout} />}
          />
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} />}
          />
          <Route
            path="/register"
            element={<Register onRegister={handleRegister} />}
          />
          <Route
            path="/dashboard"
            element={<PrivateRoute token={token} component={Dashboard} handleLogout={handleLogout} />}
          />
          <Route path="/edit/:workoutId" element={<EditWorkout token={token} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
