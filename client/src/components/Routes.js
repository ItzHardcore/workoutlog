import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Landing from '../pages/Landing';
import Dashboard from '../pages/Dashboard';
import Login from '../components/Login';
import Register from '../components/Register';
import EditWorkout from '../pages/EditWorkout';
import Profile from '../pages/Profile';
import WorkoutSession from '../pages/WorkoutSesson';
import SessionDetails from '../pages/SessionDetails';


const AppRoutes = ({ token, handleLogout, handleLogin, handleRegister }) => {
  return (
    <Routes>
      <Route path="/" element={<Landing token={token} handleLogout={handleLogout} />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/register" element={<Register onRegister={handleRegister} />} />
      <Route path="/dashboard" element={<PrivateRoute token={token} component={Dashboard} handleLogout={handleLogout} />} />
      <Route path="/edit/:workoutId" element={<PrivateRoute token={token} component={EditWorkout} />} />
      <Route path="/profile" element={<PrivateRoute token={token} handleLogin={handleLogin} component={Profile}/>} />
      <Route path="/startsession/:workoutId" element={<PrivateRoute component={WorkoutSession} token={token} />} />
      <Route path="/session/:sessionId" element={<PrivateRoute component={SessionDetails} token={token} />} />

    </Routes>
  );
};

export default AppRoutes;
