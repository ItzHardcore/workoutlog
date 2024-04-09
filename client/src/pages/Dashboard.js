import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import SessionsCards from '../components/SessionsCards';
import WorkoutsCards from '../components/WorkoutsCards';
import TimerPopup from '../components/TimerPopup';
import MeasuresTable from '../components/MeasuresTable';
import ActionButton from '../styled/ActionButton';
import { useNavigate } from 'react-router-dom';
import MeasuresForm from '../components/MeasuresForm';
import FormModal from '../components/FormModal';

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

      <ActionButton text="New Workout" backgroundImage="https://blogs.nottingham.ac.uk/sport/files/2020/04/Workout-Plan_6x4_Blog.jpg" onClick={() => navigate('/new-workout')} />
      <ActionButton text="Start Workout" backgroundImage="https://i.shgcdn.com/059ec0a7-74c9-43a9-9b3f-47808a5410bd/-/format/auto/-/preview/3000x3000/-/quality/lighter/" onClick={() => navigate('/start-session')} />
      <FormModal buttonComponent={<ActionButton text="Set Weight" backgroundImage="https://as2.ftcdn.net/v2/jpg/05/80/51/67/1000_F_580516754_4Pgrqwiq1ykLjRXJUqSbIgHN07z0hCFW.jpg"  />} formComponent={<MeasuresForm/>} />
      
      </div>

      <TimerPopup />
      <SessionsCards token={token} />
      <WorkoutsCards token={token} />
      <MeasuresTable token={token} />
    </div>
  );
}

export default Dashboard;
