import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import WorkoutForm from '../components/WorkoutForm'; // Update the import path based on your file structure

const EditWorkout = ({ token }) => {
  const { workoutId } = useParams();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [workoutData, setWorkoutData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/workouts/${workoutId}`, {
          method: 'GET',
          headers: {
            'Authorization': `${token}`,
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
          setIsAuthorized(false);
          // navigate('/unauthorized');
        }
      } catch (error) {
        console.error('Error fetching workout data:', error);
        // Handle error, e.g., redirect to an error page
      }
    };

    fetchWorkoutData();
  }, [token, workoutId, navigate]);

  const handleSave = () => {
    // Implement the logic to save the edited workout data
    console.log('Save clicked!');
  };

  const handleCancel = () => {
    // Implement the logic to navigate back or handle cancellation
    console.log('Cancel clicked!');
  };

  if (!isAuthorized) {
    return <div>You can't edit this workout because it's not yours! :)</div>;
  }

  return (
    <div>
      <h2>Edit Workout</h2>
      <p>Editing workout with ID: {workoutId}</p>
      {workoutData && (
        <WorkoutForm
          userId={workoutData.user}
          token={token}
          initialData={workoutData} // Pass the exercises array from the fetched data
        />
      )}
    </div>
  );
};

export default EditWorkout;
