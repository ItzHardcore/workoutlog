import React, { useState, useEffect } from 'react';
import WorkoutsModal from './WorkoutsModal';
import { useNavigate } from 'react-router-dom';

const WorkoutsCards = ({ token }) => {
    const [workouts, setWorkouts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const fetchWorkouts = async (token) => {
        try {
            const response = await fetch('http://localhost:3001/workouts', {
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
        navigate(`/startsession/${workoutId}`);
        setShowModal(false);
    };

    const handleEditWorkout = (workoutId) => {
        navigate(`/edit/${workoutId}`);
    };

    const removeWorkout = async (workoutId) => {
        if (!window.confirm('Are you sure you want to remove this workout?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/workouts/${workoutId}`, {
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
            <button className="btn btn-success ms-2 mb-2" onClick={() => setShowModal(true)}>Start Workout</button>
            {showModal && <WorkoutsModal onClose={() => setShowModal(false)} workouts={workouts} handleStartWorkoutFromModal={handleStartWorkout} />}
            {workouts.length === 0 ? (
                <h5 className="text-danger">No workouts available</h5>
            ) : (
                <h2>My Workouts</h2>
            )}

            <div className='row row-cols-1 row-cols-sm-4 g-4 d-flex flex-nowrap overflow-auto'>
                {workouts.map(workout => (
                    <div key={workout._id} className="col">
                        <div className='card'>
                        <div className="card-body">
                            <h3 className="card-title">{workout.name}</h3>

                            {workout.exercises.map(exercise => (
                                <div key={exercise._id} className="card mt-3">
                                    <div className="card-body">
                                        <h4 className="card-title">{exercise.exercise.name}</h4>
                                        <p className="card-text">Primary Muscle: {exercise.exercise.primaryMuscle}</p>
                                        <ul className="list-group">
                                            {exercise.series.map(series => (
                                                <li key={series._id} className="list-group-item">
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <p className="mb-1">Reps: {series.reps}</p>
                                                            <p className="mb-1">Weight: {series.weight}</p>
                                                            <p className="mb-1">Notes: {series.notes}</p>
                                                        </div>
                                                        <div>
                                                            <p className="mb-1">Effort: {series.effort}</p>
                                                            <p className="mb-1">Initial Power: {series.initialPower}</p>
                                                            <p className="mb-1">Execution: {series.execution}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}

                            <div className="d-flex mt-3">
                                <button className="btn btn-warning me-2" onClick={() => handleEditWorkout(workout._id)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => removeWorkout(workout._id)}>Remove</button>
                            </div>
                        </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkoutsCards;
