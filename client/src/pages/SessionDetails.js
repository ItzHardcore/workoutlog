import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SessionDetails = ({ token }) => {
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/workoutSessions/${sessionId}`, {
          method: 'GET',
          headers: {
            Authorization: `${token}`, // Use appropriate authorization header with Bearer prefix
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch session details');
        }

        const sessionData = await response.json();
        setSessionData(sessionData);
      } catch (error) {
        console.error('Error fetching session details:', error);
        // Handle error, e.g., display an error message to the user
      }
    };

    fetchSessionDetails();
  }, [sessionId, token]);

  if (!sessionData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Session Details</h2>
      <div>
        <p><strong>Workout:</strong> {sessionData.workoutName}</p>
        <p><strong>Start Date:</strong> {new Date(sessionData.startDate).toLocaleString()}</p>
        <p><strong>End Date:</strong> {sessionData.endDate ? new Date(sessionData.endDate).toLocaleString() : 'Not ended'}</p>
        <p><strong>Duration:</strong> {calculateDuration(sessionData.startDate, sessionData.endDate)}</p>
      </div>
      <div>
        <h3>Exercises:</h3>
        {sessionData.exercises.map((exercise, index) => (
          <div key={index} className="card mb-4 w-50">
            <div className="card-body">
              <h4 className="card-title">{exercise.name}</h4>
              <ul className="list-group list-group-flush">
                {exercise.series.map((series, index) => (
                  <li key={index} className="list-group-item">
                    <p><strong>Reps:</strong> {series.reps}</p>
                    <p><strong>Weight:</strong> {series.weight} kg</p>
                    <p><strong>Notes:</strong> {series.notes}</p>
                    <p><strong>Effort:</strong> {series.effort}</p>
                    <p><strong>Initial Power:</strong> {series.initialPower}</p>
                    {/* Add more series details as needed */}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const calculateDuration = (startDate, endDate) => {
  if (!endDate) return 'Not ended';
  const durationInSeconds = Math.floor((new Date(endDate) - new Date(startDate)) / 1000);
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = durationInSeconds % 60;
  return `${hours}h ${minutes}min ${seconds}s`;
};

export default SessionDetails;
