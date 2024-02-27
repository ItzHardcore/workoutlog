import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import WorkoutForm from '../components/WorkoutForm'; // Assuming WorkoutForm is imported correctly
import { jwtDecode } from 'jwt-decode';

const WorkoutSession = ({ token }) => {
  const { workoutId } = useParams(); // Extract workout ID from route parameters
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [workoutData, setWorkoutData] = useState(null);
  const [seconds, setSeconds] = useState(0); // Initialize timer state
  const [duration, setDuration] = useState(''); // Initialize duration state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/workouts/${workoutId}`, {
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
        } else {
          navigate('/unauthorized'); // Redirect to unauthorized page
        }
      } catch (error) {
        console.error('Error fetching workout data:', error);
        navigate('/error'); // Redirect to an error page for better user experience
      }
    };

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

  if (!isAuthorized) {
    return <div>You are not authorized to view this workout.</div>;
  }

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
          series: exerciseObject.series.map((series) => ({
            reps: series.reps,
            weight: series.weight,
            notes: series.notes,
            effort: series.effort,
            initialPower: series.initialPower
          }))
        }))
      };
  
      const response = await fetch(`http://localhost:3001/workoutSession`, {
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
      // Handle success (e.g., display a success message or redirect)
      alert('Workout saved successfully!');
    } catch (error) {
      console.error('Error saving workout data:', error);
      // Handle error (e.g., display an error message)
      alert('An error occurred while saving the workout. Please try again.');
    }
  };
  

  return (
    <div>
      <h2>Workout {workoutId}</h2>
      <h4>Duration: {duration}</h4> 
      {workoutData && (
        <WorkoutForm
          userId={workoutData.user}
          token={token}
          initialData={workoutData} // Assuming 'exercises' is the array name
          onSave={handleSave}
          
        />
      )}
    </div>
  );
};

export default WorkoutSession;
