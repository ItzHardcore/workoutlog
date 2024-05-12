import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import WorkoutForm from '../components/WorkoutForm'; // Assuming WorkoutForm is imported correctly
import { jwtDecode } from 'jwt-decode';
import TimerPopup from '../components/TimerPopup';

const WorkoutSession = ({ token }) => {
  const { workoutId } = useParams(); // Extract workout ID from route parameters
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [workoutData, setWorkoutData] = useState(null);
  const [seconds, setSeconds] = useState(0); // Initialize timer state
  const [duration, setDuration] = useState(''); // Initialize duration state
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const response = await fetch(`${REACT_APP_BACKEND_URL}/workouts/${workoutId}`, {
          method: 'GET',
          headers: {
            Authorization: `${token}`, // Use appropriate authorization header with Bearer prefix
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch workout data');
        }

        const fetchedWorkoutData = await response.json();
        const decodedToken = jwtDecode(token);
        const authenticatedUserId = decodedToken.userId;

        if (fetchedWorkoutData.user === authenticatedUserId) {
          setIsAuthorized(true);
          setWorkoutData(fetchedWorkoutData);
        }
      } catch (error) {
        console.error('Error fetching workout data:', error);
      }
    };
    const decodedToken = jwtDecode(token);
    setUsername(decodedToken.userId);
    fetchWorkoutData();
  }, [token, workoutId, navigate]);

  // Timer logic (adapt according to your specific requirements)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);

      // Calculate and update duration based on seconds
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      setDuration(`${hours}h ${minutes}min ${remainingSeconds}s`); // Update duration
    }, 1000);

    return () => clearInterval(intervalId);
  }, [seconds]); // Run timer effect only once


  const handleSave = async (toBeSavedWorkout) => {
    try {
      const startDate = new Date(Date.now() - seconds * 1000); // Use the current date as the start date
      const updatedWorkout = {
        startDate,
        endDate: new Date(),
        user: toBeSavedWorkout.user,
        workoutName: toBeSavedWorkout.name,
        exercises: toBeSavedWorkout.exercises.map((exerciseObject) => ({
          name: exerciseObject.exercise.name, // Access the exercise name
          initialPower: exerciseObject.initialPower.initialPower,
          series: exerciseObject.series.map((series) => ({
            reps: series.reps,
            weight: series.weight,
            notes: series.notes,
            effort: series.effort
          }))
        }))
      };
      console.log(updatedWorkout.exercises);
      const response = await fetch(`${REACT_APP_BACKEND_URL}/workoutSession`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Use the correct authorization header format
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedWorkout),
      });

      if (!response.ok) {
        throw new Error('Failed to save workout data');
      }

      const savedWorkoutData = await response.json();
      console.log('Workout saved successfully:', savedWorkoutData);
      navigate('/dashboard');

      alert('Session saved successfully!');
    } catch (error) {
      console.error('Error saving workout data:', error);
      // Handle error (e.g., display an error message)
      alert('An error occurred while saving the workout. Please try again.');
    }
  };


  return (
    <>
      <TimerPopup />
      <h2>It's training time! 💪</h2>
      <h4>Duration: {duration}</h4>
      {workoutData && (
        <WorkoutForm
          userId={workoutData.user}
          token={token}
          initialData={workoutData} // Assuming 'exercises' is the array name
          onSave={handleSave}

        />
      )}
      {!isAuthorized && (<WorkoutForm
        userId={username}
        token={token}
        onSave={handleSave}
        startBlankSession={true}
      />)}
    </>
  );
};

export default WorkoutSession;
