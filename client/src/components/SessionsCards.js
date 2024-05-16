import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SessionsCards = ({ token }) => {
    const [sessions, setSessions] = useState([]);
    const BASE_URL = require('./baseUrl');
    const navigate = useNavigate();

    const fetchSessions = async () => {
        try {
            const response = await fetch(`${BASE_URL}/last10workoutSessions`, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch sessions');
            }

            const data = await response.json();
            setSessions(data);
            console.log(data);
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, [token]);//Call fetchSessions on component mount

    const calculateVolume = exercise => {
        let volume = 0;
        //Iterate through each series of the exercise and calculate volume
        exercise.series.forEach(series => {
            volume += series.reps * series.weight;
        });
        return volume;
    };

    const handleStartWorkout = (workoutId) => {
        navigate(`/start-session/${workoutId}`);
    };

    const removeWorkout = async (workoutId) => {
        if (!window.confirm('Are you sure you want to remove this session?')) {
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/workoutSession/${workoutId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to remove Session');
            }

            setSessions(prevSessions => prevSessions.filter(session => session._id !== workoutId));

            console.log('WorkoutSession removed successfully');
        } catch (error) {
            console.error('Error removing workout:', error);
        }
    };

    const calculateDuration = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        //Calculate the difference in milliseconds
        const durationMs = end - start;

        //Convert milliseconds to hours, minutes, and seconds
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);

        //Initialize an empty array to store non-zero duration components
        const durationComponents = [];

        //Add non-zero components to the array
        if (hours > 0) {
            durationComponents.push(`${hours}h`);
        }
        if (minutes > 0) {
            durationComponents.push(`${minutes}min`);
        }
        if (seconds > 0) {
            durationComponents.push(`${seconds}s`);
        }

        //Join the components with a space separator
        return durationComponents.join(' ');
    };

    const calculateTotalVolume = exercises => {
        let totalVolume = 0;
        //Iterate through each exercise and calculate volume
        exercises.forEach(exercise => {
            totalVolume += calculateVolume(exercise);
        });
        return totalVolume;
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    return (
        <div className='d-block'>
            <h3>My Sessions</h3>
            {sessions.length === 0 ? (
                <h5 className="text-danger">You have no sessions</h5>
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 g-4 d-flex flex-nowrap overflow-auto">
                    {sessions.map(session => (
                        <div key={session._id} className="col mb-3">
                            <div className="card" style={{ minHeight: "100%" }}>
                                <div className="card-body">
                                    <h4 className="card-title mb-0 text-capitalize">{session.workoutName}</h4>
                                    <p className="card-text mb-0">{formatDate(session.startDate)}</p>
                                    <p className="card-text">Total volume: {calculateTotalVolume(session.exercises)} Kg</p>
                                    {session.endDate && (
                                        <p className="card-text position-absolute bottom-0 end-0 m-3">Duration: {calculateDuration(session.startDate, session.endDate)}</p>
                                    )}

                                    <h5 className="card-title">Exercises:</h5>
                                    <div className='mb-5'>
                                        {session.exercises.slice(0, 3).map((exercise, index) => (
                                            <h6 className="card-text mb-2" key={index}>{exercise.series.length} {exercise.series.length === 1 ? 'set' : 'sets'} of {exercise.name} @ Volume: {calculateVolume(exercise)} Kg</h6>
                                        ))}
                                    </div>
                                    <Link to={`/session/${session._id}`} className="btn btn-primary me-2" >View Details</Link>
                                    <button className="btn btn-danger me-2" onClick={() => removeWorkout(session._id)}>Remove</button>
                                    <button className="btn btn-success me-2" onClick={() => handleStartWorkout(session._id)}>Start Workout</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

    );
};

export default SessionsCards;
