import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WorkoutForm = ({ userId, token, initialData, onCancel, onSave }) => {
  const [workoutName, setWorkoutName] = useState(initialData ? initialData.name : '');
  const [exercises, setExercises] = useState(initialData ? initialData.exercises : []);
  const [exerciseOptions, setExerciseOptions] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [saveloading, setSaveLoading] = useState(false);

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
          // Set workout name
          setWorkoutName(initialData.name);

          // Map exercises to set series with default values
          const mappedExercises = initialData.exercises.map((exercise) => {
            const { exercise: { name }, series } = exercise;
            const mappedSeries = series.map((s) => ({
              ...s,
              reps: s.reps.toString(), // Convert to string to handle number input
              weight: s.weight.toString(),
            }));
            return {
              name,
              series: mappedSeries,
            };
          });

          // Set exercises
          setExercises(mappedExercises);
        }
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };

    fetchExercises();
  }, [token, initialData]);

  const handleAddExercise = () => {
    if (!selectedExercise) {
      console.error('Please select an exercise before adding.');
      return;
    }

    const newExercise = {
      name: selectedExercise,
      series: [{
        reps: 0,  // You can set default values for the series fields
        weight: 0,
        notes: '',
        effort: 1,
        initialPower: 1
      }],
    };

    setExercises([...exercises, newExercise]);
    setSelectedExercise('');
  };

  const handleAddSeries = (exerciseIndex) => {
    const newExercises = [...exercises];
    const selectedExercise = newExercises[exerciseIndex];

    if (!selectedExercise) {
      console.error('Invalid exercise index');
      return;
    }

    // Create a new series with empty values
    const newSeries = {
      reps: 0,
      weight: 0,
      notes: '',
      effort: 1,
      initialPower: 1
    };

    // Add the new series to the selected exercise
    selectedExercise.series.push(newSeries);

    // Update the state
    setExercises(newExercises);
  };

  const handleSeriesChange = (exerciseIndex, seriesIndex, key, value) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].series[seriesIndex][key] = value;
    setExercises(newExercises);
  };

  const handleRemoveExercise = (exerciseIndex) => {
    const newExercises = [...exercises];
    newExercises.splice(exerciseIndex, 1);
    setExercises(newExercises);
  };

  const handleRemoveSeries = (exerciseIndex, seriesIndex) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].series.splice(seriesIndex, 1);
    setExercises(newExercises);
  };

  const handleSave = async () => {
    console.log(exercises);
    if (saveloading) {
      // Do nothing if already in the process of saving
      return;
    }

    setSaveLoading(true);

    try {
      if (!workoutName || exercises.length === 0) {
        console.error('Please fill in workout name and add at least one exercise.');
        return;
      }

      for (const exercise of exercises) {
        if (exercise.series.length === 0) {
          console.error('Each exercise must have at least one series.');
          return;
        }

        for (const series of exercise.series) {
          console.log(series);
          if (
            typeof series.reps === 'undefined' ||
            series.reps === '' ||
            typeof series.weight === 'undefined' ||
            series.weight === '' ||
            typeof series.effort === 'undefined' ||
            series.effort === ''
          ) {
            console.error('Please fill in all series fields for each exercise.');
            return;
          }

          if (parseFloat(series.reps) === 0 || parseFloat(series.weight) === 0) {
            console.error('Reps and weight must be greater than 0 for each series.');
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
            series: series.map((s) => ({ ...s, reps: parseInt(s.reps), weight: parseInt(s.weight) })),
          };
        }),
      };

      try {
        if (!onSave) {
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

          setWorkoutName('');
          setExercises([]);
          setSelectedExercise('');
          navigate('/dashboard');
        } else {
          onSave(workoutPayload);
        }
      } catch (error) {
        console.error('Error saving workout:', error);
      }
      
    } catch (error) {
      console.error('Error saving workout:', error);
    } finally {
      setSaveLoading(false);
    };
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

      {exercises.map((exercise, exerciseIndex) => (
        <div className="card mb-3" key={exerciseIndex}>

          <div className="card-header d-flex align-items-center justify-content-between py-2">
            <h4 className='mb-0'>{exercise.name}</h4>
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
              <div key={seriesIndex} className="mb-4 p-3 border rounded">
                <div className="d-flex m-auto align-items-baseline mb-3">
                  <div className="w-100">
                    <label className="form-label">Initial Power:</label>
                    <select
                      className="form-select"
                      value={series.initialPower}
                      onChange={(e) => handleSeriesChange(exerciseIndex, seriesIndex, 'initialPower', e.target.value)}
                      required
                    >
                      {[1, 2, 3, 4, 5].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mx-3">
                    <label className="form-label">Reps:</label>
                    <input
                      type="number"
                      className="form-control"
                      value={series.reps}
                      onChange={(e) => handleSeriesChange(exerciseIndex, seriesIndex, 'reps', e.target.value)}
                      required
                    />
                  </div>

                  <div className="me-3">
                    <label className="form-label">Weight:</label>
                    <input
                      type="number"
                      className="form-control"
                      value={series.weight}
                      onChange={(e) => handleSeriesChange(exerciseIndex, seriesIndex, 'weight', e.target.value)}
                      required
                    />
                  </div>

                  <div className=" w-100">
                    <label className="form-label">Till failure:</label>
                    <select
                      className="form-select"
                      value={series.effort}
                      onChange={(e) => handleSeriesChange(exerciseIndex, seriesIndex, 'effort', e.target.value)}
                      required
                    >
                      {[0, 1, 2, 3, 4].map((option) => (
                        <option key={option} value={option}>
                          {option === 4 ? '4+' : option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Notes:</label>
                  <textarea
                    className="form-control"
                    value={series.notes}
                    rows="1"
                    onChange={(e) => handleSeriesChange(exerciseIndex, seriesIndex, 'notes', e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => handleRemoveSeries(exerciseIndex, seriesIndex)}
                >
                  Remove Series
                </button>
              </div>
            ))}
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
      <button type="button" className="btn btn-primary me-2 mb-3" onClick={handleAddExercise}>
        Add Exercise
      </button>
      <div className='mb-3'>

        <button
          type="button"
          className="btn btn-primary me-2"
          onClick={handleSave}
          disabled={saveloading} // Disable the button when loading
        >
          {saveloading ? 'Saving...' : 'Save'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default WorkoutForm;