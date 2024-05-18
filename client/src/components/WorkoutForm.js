import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WorkoutForm = ({ userId, token, initialData, onCancel, onSave, startBlankSession = false }) => {
  const [workoutName, setWorkoutName] = useState(initialData ? initialData.name : '');
  const [exercises, setExercises] = useState(initialData ? initialData.exercises : []);
  const [exerciseOptions, setExerciseOptions] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [saveloading, setSaveLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [checkedSeries, setCheckedSeries] = useState({});
  const BASE_URL = require('./baseUrl');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch(`${BASE_URL}/exercises`, {
          headers: {
            'Authorization': `${token}`,
          },
        });

        if (!response.ok) {
          setErrorMessage('Failed to fetch exercises');
        }

        const data = await response.json();
        setExerciseOptions(data);

        if (initialData) {
          console.log(initialData);
          //Set workout name
          setWorkoutName(initialData.name !== null && initialData.name !== undefined ? initialData.name : initialData.workoutName);

          //Map exercises to set series with default values
          const mappedExercises = initialData.exercises.map((exercise) => {
            const { exercise: { name }, series } = exercise;
            const mappedSeries = series.map((s) => ({
              ...s,
              reps: s.reps.toString(),//Convert to string to handle number input
              weight: s.weight.toString(),
            }));
            return {
              name,
              initialPower: exercise.initialPower,
              series: mappedSeries,
            };
          });

          //Set exercises
          setExercises(mappedExercises);
          console.log(mappedExercises);
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
      setErrorMessage('Please select an exercise before adding.');
      return;
    }

    const newExercise = {
      name: selectedExercise,
      initialPower: 1,
      series: [{
        reps: 0, //You can set default values for the series fields
        weight: 0,
        notes: '',
        effort: 1
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
      setErrorMessage('Invalid exercise index');
      return;
    }

    //Create a new series with empty values
    const newSeries = {
      reps: 0,
      weight: 0,
      notes: '',
      effort: 1
    };

    //Add the new series to the selected exercise
    selectedExercise.series.push(newSeries);

    //Update the state
    setExercises(newExercises);
  };

  // Function to handle checkbox toggle
  const handleCheckboxToggle = (exerciseIndex, seriesIndex) => {
    setCheckedSeries((prevState) => ({
      ...prevState,
      [exerciseIndex]: {
        ...prevState[exerciseIndex],
        [seriesIndex]: !prevState[exerciseIndex]?.[seriesIndex], // Toggle the state of the series at seriesIndex within exerciseIndex
      },
    }));
  };

  const handleSeriesChange = (exerciseIndex, seriesIndex, key, value) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].series[seriesIndex][key] = value;
    setExercises(newExercises);
  };

  const handleExerciseChange = (exerciseIndex, key, value) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex][key] = value;
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
    if (saveloading) {
      //Do nothing if already in the process of saving
      return;
    }

    setSaveLoading(true);

    try {
      if (!workoutName || exercises.length === 0) {
        console.error('Please fill in workout name and add at least one exercise.');
        setErrorMessage('Please fill in workout name and add at least one exercise.');
        return;
      }

      for (const exercise of exercises) {
        if (exercise.series.length === 0) {
          console.error('Each exercise must have at least one series.');
          setErrorMessage('Each exercise must have at least one series.');
          return;
        }

        for (const series of exercise.series) {

          if (
            typeof series.reps === 'undefined' ||
            series.reps === '' ||
            typeof series.weight === 'undefined' ||
            series.weight === '' ||
            typeof series.effort === 'undefined' ||
            series.effort === ''
          ) {
            console.error('Please fill in all series fields for each exercise.');
            setErrorMessage('Please fill in all series fields for each exercise.');
            return;
          }

          if (parseFloat(series.reps) <= 0 || parseFloat(series.weight) <= 0) {
            console.error('Reps and weight must be greater than 0 for each series.');
            setErrorMessage('Reps and weight must be greater than 0 for each series.');
            return;
          }
        }
      }

      const workoutPayload = {
        name: workoutName,
        user: userId,
        exercises: exercises.map((exercise) => {
          const { name, series, initialPower } = exercise;
          return {
            exercise: { name },
            initialPower: { initialPower },
            series: series.map((s) => ({ ...s, reps: parseInt(s.reps), weight: parseInt(s.weight) })),
          };
        }),
      };
      console.log(workoutPayload);
      try {
        if (!onSave) {
          let response;
          if (initialData) {
            response = await fetch(`${BASE_URL}/workouts/${initialData._id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
              },
              body: JSON.stringify(workoutPayload),
            });
          } else {
            response = await fetch(`${BASE_URL}/workouts`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
              },
              body: JSON.stringify(workoutPayload),
            });
          }

          if (!response.ok) {
            setErrorMessage('Failed to save workout');
          }

          console.log('Workout saved successfully');

          setWorkoutName('');
          setExercises([]);
          setSelectedExercise('');
          navigate('/dashboard');
        } else {
          if (startBlankSession) {
            let responsee;
            responsee = await fetch(`${BASE_URL}/workouts`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
              },
              body: JSON.stringify(workoutPayload),
            });


            if (!responsee.ok) {
              setErrorMessage('Failed to save workout');
            }

            console.log('Workout created successfully');
            onSave(workoutPayload);
          } else {
            onSave(workoutPayload);
          }
        }
      } catch (error) {
        console.error('Error saving workout:', error);
        setErrorMessage('Error saving workout:', error);
      }

    } catch (error) {
      console.error('Error saving workout:', error);
      setErrorMessage('Error saving workout:', error);
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
    <div className="my-4">
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
            <div className="mb-4">
              <label className="form-label">Initial Power:</label>
              <select
                className="form-select"
                value={exercise.initialPower}
                onChange={(e) => handleExerciseChange(exerciseIndex, 'initialPower', e.target.value)}
                required
              >
                {[1, 2, 3, 4, 5].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {exercise.series.map((series, seriesIndex) => (
              <div key={seriesIndex} className="mb-4 p-3 border rounded" style={{
                background: checkedSeries[exerciseIndex]?.[seriesIndex] ? 'rgb(22, 198, 12, 0.29)' : 'none', // Apply specific background color if series is checked
              }}>
                <div className="d-flex m-auto align-items-baseline mb-3">

                  <div className="me-3">
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
                <div className='d-flex align-items-center'>


                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleRemoveSeries(exerciseIndex, seriesIndex)}
                  >
                    Remove Series
                  </button>
                  <div className="form-check form-switch ms-4" style={{ fontSize: "20px" }}>
                    <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={() => handleCheckboxToggle(exerciseIndex, seriesIndex)} />
                    <label>Done? 💪</label>
                  </div>
                </div>
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
      <button type="button" className="btn btn-primary me-2 mb-3" onClick={handleAddExercise}>
        Add Exercise
      </button>
      <div className='mb-3'>
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        <button
          type="button"
          className="btn btn-primary me-2"
          onClick={handleSave}
          disabled={saveloading}//Disable the button when loading
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