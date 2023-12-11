import React, { useState, useEffect } from 'react';
import WorkoutForm from './WorkoutForm';

function CreateWorkout({ token, handleLogout }) {
  const [workoutForm, setWorkoutForm] = useState(null);

  useEffect(() => {
    if (token) {
      const fetchWorkoutForm = async () => {
        const response = await fetch('/workoutForm', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setWorkoutForm(data);
      };

      fetchWorkoutForm();
    }
  }, [token]);

  const handleSaveWorkout = (workout) => {
    if (token) {
      const formData = new FormData();
      for (const key in workout) {
        if (workout.hasOwnProperty(key)) {
          formData.append(key, workout[key]);
        }
      }

      fetch('/workouts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }).then(() => {
        console.log('Workout saved successfully!');
      });
    }
  };

  return (
    <div>
      <h2>Create Workout</h2>
      <WorkoutForm workout={workoutForm} handleSaveWorkout={handleSaveWorkout} />
    </div>
  );
}

export default CreateWorkout;
