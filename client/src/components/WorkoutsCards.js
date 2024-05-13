import React, { useState, useEffect } from 'react';
import WorkoutsModal from './WorkoutsModal';
import { useNavigate } from 'react-router-dom';

const WorkoutsCards = ({ token }) => {
    const [workouts, setWorkouts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const BASE_URL = require('./baseUrl');

    const fetchWorkouts = async (token) => {
        try {
            const response = await fetch(`${BASE_URL}/last10workouts`, {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            setWorkouts(data);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleStartWorkout = (workoutId) => {
        navigate(`/ start - session/${workoutId}`);
        setShowModal(false);
    };

    const handleEditWorkout = (workoutId) => {
        navigate(`/ edit/${workoutId}`);
    };

    const removeWorkout = async (workoutId) => {
        if (!window.confirm('Are you sure you want to remove this workout?')) {
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/workouts/${workoutId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to remove workout');
            }

            setWorkouts(prevWorkouts => prevWorkouts.filter(workout => workout._id !== workoutId));
            console.log('Workout removed successfully');
        } catch (error) {
            console.error('Error removing workout:', error);
        }
    };

    useEffect(() => {
        fetchWorkouts(token);
    }, [token]);

    return (
        <div className="mt-3">
            <h2>My Workouts</h2>
            {workouts.length === 0 ? (
                <h5 className="text-danger">No workouts available</h5>
            ) : (
                <div className='row row-cols-1 row-cols-sm-4 g-4 d-flex flex-nowrap overflow-auto pb-3'>
                    {workouts.map(workout => (
                        <div key={workout._id} className="col" style={{ minHeight: "180px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            <div className='card' style={{ flex: "1" }}>
                                <div className="card-body">
                                    <h3 className="card-title">{workout.name}</h3>
                                    {workout.exercises.map((exercise, index) => (
                                        <React.Fragment key={exercise._id}>
                                            {index > 0 && ', '}
                                            {exercise.exercise.name}
                                        </React.Fragment>
                                    ))}
                                </div>
                                <div className="d-flex m-2">
                                    <button className="btn btn-warning me-2" onClick={() => handleEditWorkout(workout._id)}>Edit</button>
                                    <button className="btn btn-danger me-2" onClick={() => removeWorkout(workout._id)}>Remove</button>
                                    <button className="btn btn-success" onClick={() => handleStartWorkout(workout._id)}>Start Workout</button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WorkoutsCards;
