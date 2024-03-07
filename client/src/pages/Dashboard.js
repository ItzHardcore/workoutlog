import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import WorkoutForm from '../components/WorkoutForm';
import MeasuresForm from '../components/MeasuresForm';
import { jwtDecode } from 'jwt-decode';
import DatePicker from 'react-datepicker';
import Chart from 'chart.js/auto';

function Dashboard({ token, handleLogout }) {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [measures, setMeasures] = useState([]); // Add state for measures
  const [isWorkoutsVisible, setIsWorkoutsVisible] = useState(true);
  const [isSessionsVisible, setIsSessionsVisible] = useState(false);
  const [isMeasuresVisible, setIsMeasuresVisible] = useState(false); // Add state for measures visibility
  const [isAddWorkoutsVisible, setAddIsWorkoutsVisible] = useState(true);
  const [isAddMeasuresVisible, setAddIsMeasuresVisible] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [username, setUsername] = useState('');
  const [userID, setUserID] = useState('');
  const [saveMeasureError, setSaveMeasureError] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Function to toggle visibility
  const toggleVisibility = () => {
    fetchWorkouts(token);
    setIsWorkoutsVisible(prev => !prev);
  };

  const toggleAddWorkout = () => {
    setAddIsWorkoutsVisible(prev => !prev);
  };
  const toggleSessions = () => {
    setIsSessionsVisible(prev => !prev);
  };

  const toggleAddMeasures = () => {
    setAddIsMeasuresVisible((prev) => !prev);
  };

  useEffect(() => {
    // Decode the token and extract the username and expiration time
    const decodedToken = jwtDecode(token);
    setUsername(decodedToken.username);
    setUserID(decodedToken.userId);
    // Fetch workouts
    fetchWorkouts(token);
    fetchMeasures(token);
    fetchSessions(token);
  }, [token]);

  const WeightChart = ({ measures }) => {
    const chartRef = useRef(null);

    useEffect(() => {
      if (!chartRef.current || !measures || measures.length === 0) return;

      const labels = measures.map((measure) => new Date(measure.date).toLocaleDateString()).reverse(); // Reverse the labels array
      const weights = measures.map((measure) => measure.weight).reverse(); // Reverse the weights array

      const ctx = chartRef.current.getContext('2d');

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Weight',
            data: weights,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          }],
        },
        options: {
          scales: {
            x: {
              type: 'category',
              labels: labels,
            },
            y: {
              beginAtZero: false,
              ticks: {
                callback: function (value) {
                  return value + ' Kg'; // Add 'Kg' to the tick label
                }
              }
            },
          },
        },
      });
    }, [measures]);

    return <canvas ref={chartRef} />;
  };


  const fetchSessions = async (token) => {
    try {
      const response = await fetch('http://localhost:3001/workoutSessions', {
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


  const Modal = ({ onClose, workouts, handleStartWorkoutFromModal }) => {
    const [selectedWorkoutId, setSelectedWorkoutId] = useState('');

    const handleStart = () => {
      if (selectedWorkoutId) {
        handleStartWorkout(selectedWorkoutId);
        onClose();
      }
    };

    return (
      <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Choose a Workout</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <select value={selectedWorkoutId} onChange={(e) => setSelectedWorkoutId(e.target.value)} className="form-select">
                <option value="">Select a workout</option>
                {workouts.map(workout => (
                  <option key={workout._id} value={workout._id}>{workout.name}</option>
                ))}
              </select>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleStart}>Start</button>
            </div>
          </div>
        </div>
      </div>

    );
  };

  const toggleEditMode = (measureId) => {
    // Find the index of the measure to toggle edit mode
    const measureIndex = measures.findIndex((measure) => measure._id === measureId);

    if (measureIndex !== -1) {
      // Create a copy of the measures array to avoid mutating state directly
      const updatedMeasures = [...measures];

      // Toggle the isEditing property of the measure at the specified index
      updatedMeasures[measureIndex] = {
        ...updatedMeasures[measureIndex],
        isEditing: !updatedMeasures[measureIndex].isEditing
      };

      // Update the state with the measures array with the toggled measure
      setMeasures(updatedMeasures);
    }
  };

  const handleSaveMeasure = async (measureId) => {
    // Find the index of the measure to save
    const measureIndex = measures.findIndex((measure) => measure._id === measureId);

    if (measureIndex !== -1) {
      try {
        const updatedMeasure = { ...measures[measureIndex] };

        const response = await fetch(`http://localhost:3001/measures/${measureId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
          body: JSON.stringify(updatedMeasure),
        });

        if (!response.ok) {
          const errorData = await response.json(); // Parse the error response
          throw new Error(errorData.error || 'Failed to save measure');
        }

        // Update the measures array with the saved measure
        const updatedMeasures = [...measures];
        updatedMeasures[measureIndex] = updatedMeasure;
        setMeasures(updatedMeasures);
        console.log('Measure saved successfully');

        // Exit edit mode
        toggleEditMode(measureId);
      } catch (error) {
        console.error('Error saving measure:', error);
        setSaveMeasureError(error.message || 'Failed to save measure');
      }
    }
  };

  const handleInputChange = (measureId, field, value) => {
    const measureIndex = measures.findIndex((measure) => measure._id === measureId);
    if (measureIndex !== -1) {
      const updatedMeasures = [...measures];
      updatedMeasures[measureIndex] = {
        ...updatedMeasures[measureIndex],
        [field]: value, // Update the field value
      };
      setMeasures(updatedMeasures);
    }
  };

  const handleEditMeasure = (measureId) => {
    // Find the index of the measure to edit
    const measureIndex = measures.findIndex((measure) => measure._id === measureId);

    if (measureIndex !== -1) {
      // Create a copy of the measures array to avoid mutating state directly
      const updatedMeasures = [...measures];

      // Set the measure at the specified index to be in edit mode
      updatedMeasures[measureIndex] = {
        ...updatedMeasures[measureIndex],
        isEditing: true // Add an additional property to indicate edit mode
      };

      // Update the state with the measures array with the edited measure
      setMeasures(updatedMeasures);
    }
  };

  const handleRemoveMeasure = async (measureId) => {
    // Show the confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to delete this measure?');

    // If the user clicks "OK" in the confirmation dialog, proceed with removal
    if (isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3001/measures/${measureId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to remove measure');
        }

        setMeasures((prevMeasures) =>
          prevMeasures.filter((measure) => measure._id !== measureId)
        );
        console.log('Measure removed successfully');
      } catch (error) {
        console.error('Error removing measure:', error);
        // You can handle errors, e.g., show an error message
      }
    }
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in milliseconds
    const durationMs = end - start;

    // Convert milliseconds to hours, minutes, and seconds
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);

    // Format the duration as HH:mm:ss
    return `${hours}h ${minutes}min ${seconds}s`;
  };

  const handleEditWorkout = (workoutId) => {
    // Navigate to the edit page, you can use React Router for this
    navigate(`/edit/${workoutId}`);
  };

  const toggleMeasures = async () => {
    if (!isMeasuresVisible) {
      // Fetch measures when measures are becoming visible
      await fetchMeasures(token);
    }
    setIsMeasuresVisible((prev) => !prev);
  };

  const handleStartWorkout = (workoutId) => {
    if (workoutId) {
      navigate(`/startsession/${workoutId}`);
      setShowModal(false);
    } else {
      setShowModal(true);

    }
  };

  // Function to fetch measures
  const fetchMeasures = async (token) => {
    try {
      const response = await fetch('http://localhost:3001/measures', {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch measures');
      }

      const data = await response.json();
      setMeasures(data);
      console.log(data);
    } catch (error) {
      console.error('Failed to fetch measures:', error);
    }
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
      if (!window.confirm('Are you sure you want to remove this workout?')) {
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

      <button className="btn btn-primary ms-2 mb-2" onClick={handleLogout}>Logout</button>

      <button className="btn btn-secondary ms-2 mb-2" onClick={toggleVisibility}>Toggle Workouts</button>
      <button className="btn btn-secondary ms-2 mb-2" onClick={toggleMeasures}>Toggle Measures</button>
      <button className="btn btn-secondary ms-2 mb-2" onClick={toggleSessions}>Toggle Sessions</button>
      <button className="btn btn-success ms-2 mb-2" onClick={toggleAddWorkout}>Add Workout</button>
      <button className="btn btn-success ms-2 mb-2" onClick={toggleAddMeasures}>Add Measures</button>
      <button className="btn btn-success ms-2 mb-2" onClick={() => handleStartWorkout()}>Start Workout</button>
      {showModal &&
        <Modal onClose={() => setShowModal(false)} workouts={workouts} handleStartWorkoutFromModal={handleStartWorkout} />
      }
      <div style={{ display: isSessionsVisible ? 'block' : 'none', overflowX: 'auto' }}>
        <h3>My Sessions</h3>
        <div className="row row-cols-1 row-cols-md-2 g-4 d-flex flex-nowrap">
          {sessions.map(session => (
            <div key={session._id} className="col">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Session ID: {session._id}</h5>
                  <p className="card-text">Start Date: {new Date(session.startDate).toLocaleString()}</p>
                  <p className="card-text">End Date: {session.endDate ? new Date(session.endDate).toLocaleString() : 'Not ended yet'}</p>
                  {/* Calculate and display workout duration */}
                  {session.endDate && (
                    <p className="card-text">Duration: {calculateDuration(session.startDate, session.endDate)}</p>
                  )}
                  <p className="card-text">User ID: {session.user}</p>
                  <p className="card-text">Workout Name: {session.workoutName}</p>
                  {/* Render additional session details */}
                  {/* Example: <p className="card-text">Duration: {session.duration}</p> */}
                  <Link to={`/session/${session._id}`} className="btn btn-primary">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      <div style={{ display: isAddMeasuresVisible ? 'block' : 'none' }}>
        {/* Display MeasuresForm when isAddMeasuresVisible is true */}
        <h2 className="mt-3">Add Measures</h2>
        <MeasuresForm token={token} onCancel={toggleAddMeasures} />
      </div>

      <div style={{ display: isMeasuresVisible ? 'block' : 'none' }}>
        {/* Display Measures when isMeasuresVisible is true */}
        <h2 className="mt-3">Measures</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Weight</th>
              <th>Steps</th>
              <th>Sleep Hours</th>
              <th>Energy</th>
              <th>Hunger</th>
              <th>Stress</th>
            </tr>
          </thead>
          <tbody>
            {measures.map((measure) => (
              <tr key={measure._id}>
                <td>
                  {measure.isEditing ? (
                    <DatePicker
                      id={`date-${measure._id}`}
                      dateFormat="dd/MM/yyyy"
                      className='form-control'
                      selected={new Date(measure.date)}
                      onChange={(date) => handleInputChange(measure._id, 'date', date)}
                    />
                  ) : (
                    new Date(measure.date).toLocaleDateString()
                  )}
                </td>
                <td>
                  {measure.isEditing ? (
                    <input
                      id={`weight-${measure._id}`}
                      className='form-control'
                      type="number"
                      value={measure.weight}
                      onChange={(e) => handleInputChange(measure._id, 'weight', e.target.value)}
                    />
                  ) : (
                    `${measure.weight} Kg`
                  )}
                </td>
                <td>
                  {measure.isEditing ? (
                    <input
                      id={`steps-${measure._id}`}
                      className='form-control'
                      type="number"
                      value={measure.steps}
                      onChange={(e) => handleInputChange(measure._id, 'steps', e.target.value)}
                    />
                  ) : (
                    `${measure.steps}`
                  )}
                </td>
                <td>
                  {measure.isEditing ? (
                    <input
                      id={`sleepHours-${measure._id}`}
                      className='form-control'
                      type="number"
                      value={measure.sleepHours}
                      onChange={(e) => handleInputChange(measure._id, 'sleepHours', e.target.value)}
                    />
                  ) : (
                    `${measure.sleepHours} Hours`
                  )}
                </td>
                <td>
                  {measure.isEditing ? (
                    <select
                      id={`energy-${measure._id}`}
                      className='form-select'
                      value={measure.energy}
                      onChange={(e) => handleInputChange(measure._id, 'energy', e.target.value)}
                    >
                      {[1, 2, 3, 4, 5].map(value => (
                        <option key={value} value={value}>{value}</option>
                      ))}
                    </select>
                  ) : (
                    `${measure.energy}`
                  )}
                </td>
                <td>
                  {measure.isEditing ? (
                    <select
                      id={`hunger-${measure._id}`}
                      className='form-select'
                      value={measure.hunger}
                      onChange={(e) => handleInputChange(measure._id, 'hunger', e.target.value)}
                    >
                      {[1, 2, 3, 4, 5].map(value => (
                        <option key={value} value={value}>{value}</option>
                      ))}
                    </select>
                  ) : (
                    `${measure.hunger}`
                  )}
                </td>
                <td>
                  {measure.isEditing ? (
                    <select
                      id={`stress-${measure._id}`}
                      className='form-select'
                      value={measure.stress}
                      onChange={(e) => handleInputChange(measure._id, 'stress', e.target.value)}
                    >
                      {[1, 2, 3, 4, 5].map(value => (
                        <option key={value} value={value}>{value}</option>
                      ))}
                    </select>
                  ) : (
                    `${measure.stress}`
                  )}
                </td>


                <td>
                  {measure.isEditing ? (
                    <button className="btn btn-success mb-2 me-2" onClick={() => handleSaveMeasure(measure._id)}>Save</button>
                  ) : (
                    <button className="btn btn-warning mb-2 me-2" onClick={() => handleEditMeasure(measure._id)}>Edit</button>
                  )}
                  <button className="btn btn-danger mb-2" onClick={() => handleRemoveMeasure(measure._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {saveMeasureError && (
          <div className="alert alert-danger mt-2 d-table-cell" role="alert">
            {saveMeasureError}
          </div>
        )}

        <WeightChart measures={measures} />
      </div>

      <div className="mt-3" style={{ display: isWorkoutsVisible ? 'none' : 'block', overflowX: 'auto' }}>
        {workouts.length === 0 ? (
          <h5 className="text-danger">No workouts available</h5>
        ) : (
          <h2>My Workouts</h2>
        )}

        <div className='d-flex flex-nowrap'>
          {workouts.map(workout => (
            <div key={workout._id} className="card mt-3 mx-2" style={{ minWidth: '18rem', maxWidth: '18rem' }}>
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

                <div className="d-flex mt-3">
                  <button className="btn btn-warning me-2" onClick={() => handleEditWorkout(workout._id)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => removeWorkout(workout._id)}>Remove</button>
                  <button className="btn btn-success ms-2" onClick={() => handleStartWorkout(workout._id)}>Start Workout</button>
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