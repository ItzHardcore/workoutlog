import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const WorkoutForm = ({ userId, token, initialData, onCancel }) => {
  const [workoutName, setWorkoutName] = useState(initialData ? initialData.name : '');
  const [exercises, setExercises] = useState(initialData ? initialData.exercises : []);
  const [exerciseOptions, setExerciseOptions] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [seriesReps, setSeriesReps] = useState('');
  const [seriesWeight, setSeriesWeight] = useState('');
  const [seriesNotes, setSeriesNotes] = useState('');
  const [seriesEffort, setSeriesEffort] = useState(1);
  const [seriesInitialPower, setSeriesInitialPower] = useState(1);
  const [seriesExecution, setSeriesExecution] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('http://localhost:3001/exercises', {
          headers: {
            'Authorization': `${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch exercises');
        }
  
        const data = await response.json();
        setExerciseOptions(data);
  
        if (initialData) {
          // If there is initialData, format it for editing
          setWorkoutName(initialData.name);
          setExercises(initialData.exercises.map((exercise) => {
            const { exercise: { name }, series } = exercise;
            return {
              name,
              series,
            };
          }));
        }
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };
  
    fetchExercises();
  }, [token, initialData]);
  

  const handleAddExercise = () => {
    // Check if an exercise is selected
    if (!selectedExercise) {
      // Display an error message or handle it in your preferred way
      console.error('Please select an exercise before adding.');
      return;
    }
  
    const newExercise = {
      name: selectedExercise,
      series: [],
    };
  
    setExercises([...exercises, newExercise]);
    setSelectedExercise('');
  };

  const handleRemoveExercise = (exerciseIndex) => {
    const newExercises = [...exercises];
    newExercises.splice(exerciseIndex, 1);
    setExercises(newExercises);
  };

  const handleAddSeries = (exerciseIndex) => {
    // Check if all required fields are filled
    if (!seriesReps || !seriesWeight || !seriesEffort || !seriesInitialPower || !seriesExecution) {
      // Display an error message or handle it in your preferred way
      console.error('Please fill in all series fields before adding a series.');
      return;
    }
  
    const newExercises = [...exercises];
    const newSeries = {
      reps: parseInt(seriesReps, 10),
      weight: parseInt(seriesWeight, 10),
      notes: seriesNotes,
      effort: parseInt(seriesEffort, 10),
      initialPower: parseInt(seriesInitialPower, 10),
      execution: parseInt(seriesExecution, 10),
    };
  
    if (newExercises.length === 0 || !newExercises[newExercises.length - 1].name) {
      newExercises.push({ name: selectedExercise, workoutName, series: [newSeries] });
    } else {
      newExercises[exerciseIndex].series.push(newSeries);
    }
  
    setExercises(newExercises);
    setSeriesReps('');
    setSeriesWeight('');
    setSeriesNotes('');
    setSeriesEffort(1);
    setSeriesInitialPower(1);
    setSeriesExecution(1);
  };
  

  const handleRemoveSeries = (exerciseIndex, seriesIndex) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].series.splice(seriesIndex, 1);
    setExercises(newExercises);
  };

  const handleSave = async () => {
    // Validate required fields
    if (!workoutName || exercises.length === 0) {
      console.error('Please fill in workout name.');
      return;
    }
  
    // Check if any series has missing required fields
    for (const exercise of exercises) {
      for (const series of exercise.series) {
        if (!series.reps || !series.weight || !series.effort || !series.initialPower || !series.execution) {
          console.error('Please fill in all series fields.');
          return;
        }
      }
    }
  
    const workoutPayload = {
      name: workoutName,
      user: userId,
      exercises: exercises.map((exercise) => {
        const { name, series } = exercise;
        return {
          exercise: { name },
          series,
        };
      }),
    };
  
    try {
      let response;
  
      if (initialData) {
        response = await fetch(`http://localhost:3001/workouts/${initialData._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
          body: JSON.stringify(workoutPayload),
        });
      } else {
        response = await fetch('http://localhost:3001/workouts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
          body: JSON.stringify(workoutPayload),
        });
      }
  
      if (!response.ok) {
        throw new Error('Failed to save workout');
      }
  
      console.log('Workout saved successfully');
  
      // Reset form fields
      setWorkoutName('');
      setExercises([]);
      setSelectedExercise('');
      setSeriesReps('');
      setSeriesWeight('');
      setSeriesNotes('');
      setSeriesEffort(1);
      setSeriesInitialPower(1);
      setSeriesExecution(1);
  
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };
  

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="w-50 my-4">
      <h2 className="mb-4">Workout Form</h2>
      <div className="mb-3">
        <label className="form-label">Workout Name:</label>
        <input
          type="text"
          className="form-control"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Exercise Name:</label>
        <select
          className="form-select"
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
          required
        >
          <option value="" disabled>Select an exercise</option>
          {exerciseOptions.map((exercise) => (
            <option key={exercise._id} value={exercise.name}>
              {exercise.name}
            </option>
          ))}
        </select>
      </div>
      <button type="button" className="btn btn-primary me-2" onClick={handleAddExercise}>
        Add Exercise
      </button>

      {exercises.map((exercise, exerciseIndex) => (
        <div className="card mb-3" key={exerciseIndex}>
          <div className="card-header">
            <h4>{exercise.name}</h4>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => handleRemoveExercise(exerciseIndex)}
            >
              Remove Exercise
            </button>
          </div>
          <div className="card-body">
            {exercise.series.map((series, seriesIndex) => (
              <div key={seriesIndex} className="mb-3">
                <p>{`Serie ${seriesIndex + 1}`}</p>
                <p>Reps: {series.reps}</p>
                <p>Weight: {series.weight}</p>
                <p>Notes: {series.notes}</p>
                <p>Effort: {series.effort}</p>
                <p>Initial Power: {series.initialPower}</p>
                <p>Execution: {series.execution}</p>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => handleRemoveSeries(exerciseIndex, seriesIndex)}
                >
                  Remove Series
                </button>
              </div>
            ))}
            <div className="mb-3">
              <label className="form-label">Series Reps:</label>
              <input
                type="number"
                className="form-control"
                value={seriesReps}
                onChange={(e) => setSeriesReps(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Series Weight:</label>
              <input
                type="number"
                className="form-control"
                value={seriesWeight}
                onChange={(e) => setSeriesWeight(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Series Notes:</label>
              <textarea
                className="form-control"
                value={seriesNotes}
                onChange={(e) => setSeriesNotes(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Series Effort (1-5):</label>
              <select
                className="form-select"
                value={seriesEffort}
                onChange={(e) => setSeriesEffort(e.target.value)}
                required
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Series Initial Power (1-5):</label>
              <select
                className="form-select"
                value={seriesInitialPower}
                onChange={(e) => setSeriesInitialPower(e.target.value)}
                required
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Series Execution (1-5):</label>
              <select
                className="form-select"
                value={seriesExecution}
                onChange={(e) => setSeriesExecution(e.target.value)}
                required
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => handleAddSeries(exerciseIndex)}
            >
              Add Series
            </button>
          </div>
        </div>
      ))}

      <button type="button" className="btn btn-primary me-2" onClick={handleSave}>
        Save
      </button>
      <button type="button" className="btn btn-secondary" onClick={handleCancel}>
        Cancel
      </button>
    </div>
  );
};

export default WorkoutForm;