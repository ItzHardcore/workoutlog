import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditWorkout = ({ token}) => {
  const { workoutId } = useParams();
  const [isAuthorized, setIsAuthorized] = useState(false);
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

        const workoutData = await response.json();
        const decodedToken = jwtDecode(token);
    const authenticatedUserId = decodedToken.userId;

        if (workoutData.user === authenticatedUserId) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          //navigate('/unauthorized');
        }
      } catch (error) {
        console.error('Error fetching workout data:', error);
        // Handle error, e.g., redirect to an error page
      }
    };

    fetchWorkoutData();
  }, [token, workoutId, navigate]);

  if (!isAuthorized) {
    return <div>You can't edit this workout, because it's not yours! :)</div>;
  }

  return (
    <div>
      <h2>Edit Workout</h2>
      <p>Editing workout with ID: {workoutId}</p>
      {/* Include your WorkoutForm component here with the workout data */}
    </div>
  );
};

export default EditWorkout;
