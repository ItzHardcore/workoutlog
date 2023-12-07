// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import LoginForm from './components/Login';
import RegisterForm from './components/Register';

const Home = ({ token, handleLogout }) => {
  return (
    <div>
      <h2>Home</h2>
      {token ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <>
          <Navigate to="/login" />
          <Navigate to="/register" />
        </>
      )}
    </div>
  );
};

const PrivateRoute = ({ token, component: Component }) => {
  return token ? <Component /> : <Navigate to="/login" />;
};

const Dashboard = () => {
  return <h2>Dashboard</h2>;
};

const App = () => {
  const [token, setToken] = useState('');

  const handleLogin = (token) => {
    setToken(token);
    return <Navigate to="/dashboard" />;
  };

  const handleLogout = () => {
    setToken('');
  };

  const handleRegister = (message) => {
    console.log(message); // You can handle the registration success message here
    return <Navigate to="/login" />;
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route
            path="/"
            element={<Home token={token} handleLogout={handleLogout} />}
          />
          <Route
            path="/login"
            element={<LoginForm onLogin={handleLogin} />}
          />
          <Route
            path="/register"
            element={<RegisterForm onRegister={handleRegister} />}
          />
          <Route
            path="/dashboard"
            element={<PrivateRoute token={token} component={Dashboard} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
