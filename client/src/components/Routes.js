import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Landing from '../pages/Landing';
import Dashboard from '../pages/Dashboard';
import Login from '../components/Login';
import Register from '../components/Register';
import EditWorkout from '../pages/EditWorkout';
import EditProfile from '../pages/EditProfile';

const AppRoutes = ({ token, handleLogout, handleLogin, handleRegister }) => {
  return (
    <Routes>
      <Route path="/" element={<Landing token={token} handleLogout={handleLogout} />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/register" element={<Register onRegister={handleRegister} />} />
      <Route path="/dashboard" element={<PrivateRoute token={token} component={Dashboard} handleLogout={handleLogout} />} />
      <Route path="/edit/:workoutId" element={<EditWorkout token={token} />} />
      <Route path="/edit-profile" element={<EditProfile token={token} handleLogin={handleLogin} />} />
    </Routes>
  );
};

export default AppRoutes;
