import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { createMeasure } from '../reducers/measuresSlice';
import { useDispatch } from 'react-redux';

function MeasuresForm({ token, onClose }) {
  const dispatch = useDispatch();
  const [weight, setWeight] = useState('');
  const [steps, setSteps] = useState(10000);
  const [sleepHours, setSleepHours] = useState(8);
  const [energy, setEnergy] = useState(3);
  const [hunger, setHunger] = useState(3);
  const [stress, setStress] = useState(3);
  const [date, setDate] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleCancel = () => {
    if (onClose) {
      onClose();//Call onClose if defined
    } else {
      navigate('/mybody');//Navigate to '/mybody' if onClose is not defined
    }
  };

  const handleAddMeasures = async (e) => {
    e.preventDefault();

    //Validate form data
    if (!weight || isNaN(weight) || weight <= 0) {
      setErrorMessage('Weight is required and must be a positive number.');
      return;
    }

    if (isNaN(energy) || energy < 1 || energy > 5 || isNaN(hunger) || hunger < 1 || hunger > 5 || isNaN(stress) || stress < 1 || stress > 5) {
      setErrorMessage('Energy, Hunger, and Stress must be numbers between 1 and 5.');
      return;
    }

    const measuresData = {
      weight,
      steps,
      sleepHours,
      energy,
      hunger,
      stress,
      date,
    };

    try {
      //Clear error message
      setErrorMessage('');

      dispatch(createMeasure({ measuresData, token }))
        .then((action) => {
          // Handle the fulfilled state if needed
          if (action.type === createMeasure.fulfilled.type) {
            // Optionally, handle success actions here
            if (onClose) {
              handleCancel();
            } else {
              navigate('/mybody');
            }
          }
          if (action.type === createMeasure.rejected.type) {
            // Optionally, handle success actions here
            setErrorMessage(action.payload || 'Failed to save measures. Please try again.');
          }
        })
        .catch((error) => {
          // Handle the rejected state

          // Optionally, handle error actions here
        });
    } catch (error) {
      //Handle any errors that occur during the submission
      setErrorMessage(error.message || 'Failed to save measures. Please try again.');
    }
  };

  return (
    <form onSubmit={handleAddMeasures} className="row g-3 ">
      <h2>Add Daily Measures</h2>
      <div className="col-md-3">
        <label htmlFor="date" className="form-label">Date:</label>
        <br />
        <DatePicker
          id="date"
          selected={date}
          dateFormat="dd/MM/yyyy"
          onChange={(selectedDate) => setDate(selectedDate)}
          className={`form-control ${errorMessage && !date ? 'is-invalid' : ''}`}
        />
        {errorMessage && !date && (
          <div className="invalid-feedback">Please select a date.</div>
        )}
      </div>
      <div className="col-md-3">
        {/* Weight */}
        <label htmlFor="weight" className="form-label">Weight:</label>
        <div className="input-group">
          <input
            type="number"
            id="weight"
            className={`form-control ${errorMessage && !weight ? 'is-invalid' : ''} `}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <span className="input-group-text">Kg</span>
        </div>
        {errorMessage && !weight && (
          <div className="invalid-feedback">Please enter weight.</div>
        )}
      </div>
      <div className="col-md-3">
        {/* Steps */}
        <label htmlFor="steps" className="form-label">Steps:</label>
        <input
          type="text"
          id="steps"
          className={`form-control ${errorMessage && !steps ? 'is-invalid' : ''} `}
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
        />
        {errorMessage && !steps && (
          <div className="invalid-feedback">Please enter steps.</div>
        )}
      </div>
      <div className="col-md-3">
        {/* Sleep Hours */}
        <label htmlFor="sleepHours" className="form-label">Sleep Hours:</label>
        <input
          type="text"
          id="sleepHours"
          className={`form-control ${errorMessage && !sleepHours ? 'is-invalid' : ''} `}
          value={sleepHours}
          onChange={(e) => setSleepHours(e.target.value)}
        />
        {errorMessage && !sleepHours && (
          <div className="invalid-feedback">Please enter sleep hours.</div>
        )}
      </div>
      <div className="col-md-4">
        {/* Stress Rating Slider */}
        <label htmlFor="stress" className="form-label">Stress Rating:</label>
        <input
          type="range"
          className="form-range"
          id="stress"
          min="1"
          max="5"
          value={stress}
          onChange={(e) => setStress(parseInt(e.target.value))}
        />
        <output htmlFor="stress">{stress}</output>
      </div>
      <div className="col-md-4">
        {/* Energy Rating Slider */}
        <label htmlFor="energy" className="form-label">Energy Rating:</label>
        <input
          type="range"
          className="form-range"
          id="energy"
          min="1"
          max="5"
          value={energy}
          onChange={(e) => setEnergy(parseInt(e.target.value))}
        />
        <output htmlFor="energy">{energy}</output>
      </div>
      <div className="col-md-4">
        {/* Hunger Rating Slider */}
        <label htmlFor="hunger" className="form-label">Hunger Rating:</label>
        <input
          type="range"
          className="form-range"
          id="hunger"
          min="1"
          max="5"
          value={hunger}
          onChange={(e) => setHunger(parseInt(e.target.value))}
        />
        <output htmlFor="hunger">{hunger}</output>
      </div>
      <div className="col-12">
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        <button type="submit" className="btn btn-primary">Add Measures</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={handleCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default MeasuresForm;
