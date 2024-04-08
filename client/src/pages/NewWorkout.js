import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import WorkoutForm from '../components/WorkoutForm'
import { useNavigate } from 'react-router-dom';

const NewWorkout = ({ token }) => {
    const [userID, setUserID] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const decodedToken = jwtDecode(token);
        setUserID(decodedToken.userId);
    }, [token]);


    return (
        <div className='mt-5'>
            <h2>Add Workout</h2>
            <WorkoutForm userId={userID} token={token} onCancel={() => navigate('/dashboard')} />
        </div>
    )
}

export default NewWorkout