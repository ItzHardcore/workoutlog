import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkoutForm from '../components/WorkoutForm';
import { jwtDecode } from 'jwt-decode';

function Dashboard({ token, handleLogout }) {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [isWorkoutsVisible, setIsWorkoutsVisible] = useState(true);
  const [isAddWorkoutsVisible, setAddIsWorkoutsVisible] = useState(true);
  const [username, setUsername] = useState('');
  const [userID, setUserID] = useState('');

  // Function to toggle visibility
  const toggleVisibility = () => {
    fetchWorkouts(token);
    setIsWorkoutsVisible(!isWorkoutsVisible);
  };

  const toggleAddWorkout = () => {
    setAddIsWorkoutsVisible(!isAddWorkoutsVisible);
  };

  useEffect(() => {
    // Decode the token and extract the username and expiration time
    const decodedToken = jwtDecode(token);
    setUsername(decodedToken.username);
    setUserID(decodedToken.userId);
    // Fetch workouts
    fetchWorkouts(token);

  }, [token]);

  const handleEditWorkout = (workoutId) => {
    // Navigate to the edit page, you can use React Router for this
    navigate(`/edit/${workoutId}`);
  };

  async function fetchWorkouts(token) {
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
      console.log(data);
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  const removeWorkout = async (workoutId) => {
    try {
      // Display a confirmation dialog
      const confirmRemove = window.confirm('Are you sure you want to remove this workout?');

      if (!confirmRemove) {
        // If the user clicks "Cancel" in the confirmation dialog, do nothing
        return;
      }

      const response = await fetch(`http://localhost:3001/workouts/${workoutId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove workout');
      }

      setWorkouts((prevWorkouts) =>
        prevWorkouts.filter((workout) => workout._id !== workoutId)
      );
      console.log('Workout removed successfully');

    } catch (error) {
      console.error('Error removing workout:', error);
      // You can handle errors, e.g., show an error message
    }
  };


  return (
    <div className="container mt-3">
      <h2>Dashboard</h2>
      <p>Welcome to the dashboard, {username}!</p>
      <p className="text-justify">You have token: {token}</p>

      <button className="btn btn-primary" onClick={handleLogout}>Logout</button>

      <button className="btn btn-secondary ms-2" onClick={toggleVisibility}>Toggle Workouts</button>
      <button className="btn btn-success ms-2" onClick={toggleAddWorkout}>Add Workout</button>

      <div className="mt-3" style={{ display: isWorkoutsVisible ? 'none' : 'block' }}>
        {workouts.length === 0 ? (
          <h5 className='text-danger'>No workouts available</h5>
        ) : (<h2>My Workouts</h2>)}

        <div className='d-flex'>

          {workouts.map(workout => (
            <div key={workout._id} className="card mt-3 w-25 mx-3">
              <div className="card-body">
                <h3 className="card-title">{workout.name}</h3>

                {/* Render exercise information */}
                {workout.exercises.map(exercise => (
                  <div key={exercise._id} className="card mt-3">
                    <div className="card-body">
                      <h4 className="card-title">{exercise.exercise.name}</h4>
                      <p className="card-text">Primary Muscle: {exercise.exercise.primaryMuscle}</p>

                      {/* Render series information */}
                      <ul className="list-group">
                        {exercise.series.map(series => (
                          <li key={series._id} className="list-group-item">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="mb-1">Reps: {series.reps}</p>
                                <p className="mb-1">Weight: {series.weight}</p>
                                <p className="mb-1">Notes: {series.notes}</p>
                                {/* Add more series details as needed */}
                              </div>
                              <div>
                                <p className="mb-1">Effort: {series.effort}</p>
                                <p className="mb-1">Initial Power: {series.initialPower}</p>
                                <p className="mb-1">Execution: {series.execution}</p>
                                {/* Add more series details as needed */}
                              </div>
                            </div>
                          </li>
                        ))}

                      </ul>
                    </div>
                  </div>
                ))}

                <div className="mt-3">
                  <button className="btn btn-danger me-2" onClick={() => removeWorkout(workout._id)}>Remove Workout</button>
                  <button className="btn btn-warning" onClick={() => handleEditWorkout(workout._id)}>Edit Workout</button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <div style={{ display: isAddWorkoutsVisible ? 'none' : 'block' }}>
        <h2 className="mt-3">Add Workout</h2>
        <WorkoutForm userId={userID} token={token} onCancel={toggleAddWorkout} />
      </div>
    </div>
  );
}

export default Dashboard;
