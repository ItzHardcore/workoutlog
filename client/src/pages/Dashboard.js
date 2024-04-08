import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import SessionsCards from '../components/SessionsCards';
import WorkoutsCards from '../components/WorkoutsCards';
import TimerPopup from '../components/TimerPopup';
import MeasuresTable from '../components/MeasuresTable';
import ActionButton from '../styled/ActionButton';
import { useNavigate } from 'react-router-dom';

function Dashboard({ token }) {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const decodedToken = jwtDecode(token);
    setUsername(decodedToken.username);
  }, [token]);

  return (
    <div className="container mt-3">
      <h2>Dashboard</h2>
      <p>Welcome to the dashboard, {username}!</p>
      <div className='d-flex'>

      <ActionButton text="New Workout" backgroundImage="https://prod-ne-cdn-media.puregym.com/media/819394/gym-workout-plan-for-gaining-muscle_header.jpg?quality=80" onClick={() => navigate('/new-workout')} />
      <ActionButton text="Set Weight" backgroundImage="https://as2.ftcdn.net/v2/jpg/05/80/51/67/1000_F_580516754_4Pgrqwiq1ykLjRXJUqSbIgHN07z0hCFW.jpg"  />
      </div>

      <TimerPopup />
      <SessionsCards token={token} />
      <WorkoutsCards token={token} />
      <MeasuresTable token={token} />
    </div>
  );
}

export default Dashboard;
