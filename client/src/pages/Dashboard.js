import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkoutForm from '../components/WorkoutForm';
import MeasuresForm from '../components/MeasuresForm';
import BodyMeasuresForm from '../components/BodyMeasuresForm';
import { jwtDecode } from 'jwt-decode';
import DatePicker from 'react-datepicker';
import Chart from 'chart.js/auto';
import BodyPhotosUpload from '../components/BodyPhotosUpload';
import BodyPhotosGallery from '../components/BodyPhotosGallery';

import SessionsCards from '../components/SessionsCards';
import WorkoutsCards from '../components/WorkoutsCards';

function Dashboard({ token, handleLogout }) {
  const [measures, setMeasures] = useState([]); // Add state for measures
  const [Bodymeasures, setBodyMeasures] = useState([]);
  const [isMeasuresVisible, setIsMeasuresVisible] = useState(false); // Add state for measures visibility
  const [isBodyMeasuresVisible, setIsBodyMeasuresVisible] = useState(false);
  const [isAddWorkoutsVisible, setAddIsWorkoutsVisible] = useState(true);
  const [isAddPhotosVisible, setAddIsPhotosVisible] = useState(true);
  const [isAddMeasuresVisible, setAddIsMeasuresVisible] = useState(false);
  const [isAddMoreMeasuresVisible, setAddMoreIsMeasuresVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [userID, setUserID] = useState('');
  const [saveMeasureError, setSaveMeasureError] = useState('');
  const [saveBodyMeasureError, setSaveBodyMeasureError] = useState('');

  const toggleVisibilityPhotos = () => {
    setAddIsPhotosVisible(prev => !prev);
  };

  const toggleAddWorkout = () => {
    setAddIsWorkoutsVisible(prev => !prev);
  };

  const toggleAddMeasures = () => {
    setAddIsMeasuresVisible((prev) => !prev);
  };
  const toggleAddMoreMeasures = () => {
    setAddMoreIsMeasuresVisible((prev) => !prev);
  };

  useEffect(() => {
    // Decode the token and extract the username and expiration time
    const decodedToken = jwtDecode(token);
    setUsername(decodedToken.username);
    setUserID(decodedToken.userId);
    fetchMeasures(token);
  }, [token]);

  const WeightChart = ({ measures }) => {
    const chartRef = useRef(null);

    useEffect(() => {
      if (!chartRef.current || !measures || measures.length === 0) return;

      const labels = measures.map((measure) => new Date(measure.date).toLocaleDateString()).reverse(); // Reverse the labels array
      const weights = measures.map((measure) => measure.weight).reverse(); // Reverse the weights array

      const ctx = chartRef.current.getContext('2d');

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Weight',
            data: weights,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          }],
        },
        options: {
          scales: {
            x: {
              type: 'category',
              labels: labels,
            },
            y: {
              beginAtZero: false,
              ticks: {
                callback: function (value) {
                  return value + ' Kg'; // Add 'Kg' to the tick label
                }
              }
            },
          },
        },
      });
    }, [measures]);

    return <canvas ref={chartRef} />;
  };


  const toggleEditMode = (measureId) => {
    // Find the index of the measure to toggle edit mode
    const measureIndex = measures.findIndex((measure) => measure._id === measureId);

    if (measureIndex !== -1) {
      // Create a copy of the measures array to avoid mutating state directly
      const updatedMeasures = [...measures];

      // Toggle the isEditing property of the measure at the specified index
      updatedMeasures[measureIndex] = {
        ...updatedMeasures[measureIndex],
        isEditing: !updatedMeasures[measureIndex].isEditing
      };

      // Update the state with the measures array with the toggled measure
      setMeasures(updatedMeasures);
    }
  };

  const toggleBodyEditMode = (bodymeasureId) => {
    // Find the index of the measure to toggle edit mode
    const measureIndex = Bodymeasures.findIndex((bodymeasure) => bodymeasure._id === bodymeasureId);

    if (measureIndex !== -1) {
      // Create a copy of the measures array to avoid mutating state directly
      const updatedMeasures = [...Bodymeasures];

      // Toggle the isEditing property of the measure at the specified index
      updatedMeasures[measureIndex] = {
        ...updatedMeasures[measureIndex],
        isEditing: !updatedMeasures[measureIndex].isEditing
      };

      // Update the state with the measures array with the toggled measure
      setBodyMeasures(updatedMeasures);
    }
  };

  const handleSaveMeasure = async (measureId) => {
    // Find the index of the measure to save
    const measureIndex = measures.findIndex((measure) => measure._id === measureId);

    if (measureIndex !== -1) {
      try {
        const updatedMeasure = { ...measures[measureIndex] };

        const response = await fetch(`http://localhost:3001/measures/${measureId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
          body: JSON.stringify(updatedMeasure),
        });

        if (!response.ok) {
          const errorData = await response.json(); // Parse the error response
          throw new Error(errorData.error || 'Failed to save measure');
        }

        // Update the measures array with the saved measure
        const updatedMeasures = [...measures];
        updatedMeasures[measureIndex] = updatedMeasure;
        setMeasures(updatedMeasures);
        console.log('Measure saved successfully');

        // Exit edit mode
        toggleEditMode(measureId);
      } catch (error) {
        console.error('Error saving measure:', error);
        setSaveMeasureError(error.message || 'Failed to save measure');
      }
    }
  };

  const handleEditMeasure = (measureId) => {
    // Find the index of the measure to edit
    const measureIndex = measures.findIndex((measure) => measure._id === measureId);

    if (measureIndex !== -1) {
      // Create a copy of the measures array to avoid mutating state directly
      const updatedMeasures = [...measures];

      // Set the measure at the specified index to be in edit mode
      updatedMeasures[measureIndex] = {
        ...updatedMeasures[measureIndex],
        isEditing: true // Add an additional property to indicate edit mode
      };

      // Update the state with the measures array with the edited measure
      setMeasures(updatedMeasures);
    }
  };

  const handleRemoveMeasure = async (measureId) => {
    // Show the confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to delete this measure?');

    // If the user clicks "OK" in the confirmation dialog, proceed with removal
    if (isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3001/measures/${measureId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to remove measure');
        }

        setMeasures((prevMeasures) =>
          prevMeasures.filter((measure) => measure._id !== measureId)
        );
        console.log('Measure removed successfully');
      } catch (error) {
        console.error('Error removing measure:', error);
        // You can handle errors, e.g., show an error message
      }
    }
  };

  const handleSaveBodyMeasure = async (bodymeasureId) => {
    // Find the index of the measure to save
    const measureIndex = Bodymeasures.findIndex((Bodymeasure) => Bodymeasure._id === bodymeasureId);

    if (measureIndex !== -1) {
      try {
        const updatedMeasure = { ...Bodymeasures[measureIndex] };

        const response = await fetch(`http://localhost:3001/bodymeasures/${bodymeasureId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
          body: JSON.stringify(updatedMeasure),
        });

        if (!response.ok) {
          const errorData = await response.json(); // Parse the error response
          throw new Error(errorData.error || 'Failed to save measure');
        }

        // Update the measures array with the saved measure
        const updatedMeasures = [...Bodymeasures];
        updatedMeasures[measureIndex] = updatedMeasure;
        setBodyMeasures(updatedMeasures);
        console.log('Measure saved successfully');

        // Exit edit mode
        toggleBodyEditMode(bodymeasureId);
      } catch (error) {
        console.error('Error saving measure:', error);
        setSaveBodyMeasureError(error.message || 'Failed to save measure');
      }
    }
  };

  const handleEditBodyMeasure = (bodymeasureId) => {
    // Find the index of the measure to edit
    const measureIndex = Bodymeasures.findIndex((Bodymeasure) => Bodymeasure._id === bodymeasureId);

    if (measureIndex !== -1) {
      // Create a copy of the measures array to avoid mutating state directly
      const updatedMeasures = [...Bodymeasures];

      // Set the measure at the specified index to be in edit mode
      updatedMeasures[measureIndex] = {
        ...updatedMeasures[measureIndex],
        isEditing: true // Add an additional property to indicate edit mode
      };

      // Update the state with the measures array with the edited measure
      setBodyMeasures(updatedMeasures);
    }
  };

  const handleRemoveBodyMeasure = async (bodymeasureId) => {
    // Show the confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to delete this measure?');

    // If the user clicks "OK" in the confirmation dialog, proceed with removal
    if (isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3001/bodymeasures/${bodymeasureId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to remove measure');
        }

        setBodyMeasures((prevMeasures) =>
          prevMeasures.filter((bodymeasure) => bodymeasure._id !== bodymeasureId)
        );
        console.log('Measure removed successfully');
      } catch (error) {
        console.error('Error removing measure:', error);
        // You can handle errors, e.g., show an error message
      }
    }
  };


  const handleInputChange = (measureId, field, value, setter) => {
    const measureIndex = measures.findIndex((measure) => measure._id === measureId);
    if (measureIndex !== -1) {
      const updatedMeasures = [...measures];
      updatedMeasures[measureIndex] = {
        ...updatedMeasures[measureIndex],
        [field]: value, // Update the field value
      };
      setter(updatedMeasures);
    }
  };

  const handleBodyInputChange = (bodymeasureId, field, value, setter) => {
    const measureIndex = Bodymeasures.findIndex((measure) => measure._id === bodymeasureId);
    if (measureIndex !== -1) {
      const updatedMeasures = [...Bodymeasures];
      updatedMeasures[measureIndex] = {
        ...updatedMeasures[measureIndex],
        [field]: value, // Update the field value
      };
      setter(updatedMeasures);
    }
  };


  const toggleMeasures = async () => {
    if (!isMeasuresVisible) {
      // Fetch measures when measures are becoming visible
      await fetchMeasures(token);
    }
    setIsMeasuresVisible((prev) => !prev);
  };

  const toggleBodyMeasures = async () => {
    if (!isBodyMeasuresVisible) {
      // Fetch measures when measures are becoming visible
      await fetchBodyMeasures(token);
    }
    setIsBodyMeasuresVisible((prev) => !prev);
  };


  // Function to fetch measures
  const fetchMeasures = async (token) => {
    try {
      const response = await fetch('http://localhost:3001/measures', {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch measures');
      }

      const data = await response.json();
      setMeasures(data);
      console.log(data);
    } catch (error) {
      console.error('Failed to fetch measures:', error);
    }
  };

  const fetchBodyMeasures = async (token) => {
    try {
      const response = await fetch('http://localhost:3001/bodymeasures', {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch measures');
      }

      const data = await response.json();
      setBodyMeasures(data);
      console.log(data);
    } catch (error) {
      console.error('Failed to fetch measures:', error);
    }
  };

  return (

    <div className="container mt-3">
      <h2>Dashboard</h2>
      <p>Welcome to the dashboard, {username}!</p>

      <button className="btn btn-secondary ms-2 mb-2" onClick={toggleMeasures}>Toggle Measures</button>
      <button className="btn btn-secondary ms-2 mb-2" onClick={toggleBodyMeasures}>Toggle Body Measures</button>
      <button className="btn btn-success ms-2 mb-2" onClick={toggleAddWorkout}>Add Workout</button>
      <button className="btn btn-success ms-2 mb-2" onClick={toggleAddMeasures}>Add Measures</button>
      <button className="btn btn-success ms-2 mb-2" onClick={toggleAddMoreMeasures}>Body Measures</button>
      <button className="btn btn-success ms-2 mb-2" onClick={toggleVisibilityPhotos}>Add Photos</button>
      
     
     <SessionsCards token={token} />

      <div style={{ display: isAddMeasuresVisible ? 'block' : 'none' }}>
        {/* Display MeasuresForm when isAddMeasuresVisible is true */}
        <h2 className="mt-3">Add Daily Measures</h2>
        <MeasuresForm token={token} onCancel={toggleAddMeasures} />
      </div>

      <div style={{ display: isAddMoreMeasuresVisible ? 'block' : 'none' }}>
        {/* Display MeasuresForm when isAddMoreMeasuresVisible is true */}
        <h2 className="mt-3">Measures</h2>
        <BodyMeasuresForm token={token} onCancel={toggleAddMoreMeasures} />
      </div>

      <div style={{ display: isMeasuresVisible ? 'block' : 'none' }}>
        {/* Display Measures when isMeasuresVisible is true */}
        <h2 className="mt-3">Measures</h2>
        <div className='table-responsive'>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight</th>
                <th className="d-none d-md-table-cell">Steps</th>
                <th className="d-none d-md-table-cell">Sleep Hours</th>
                <th className="d-none d-md-table-cell">Energy</th>
                <th className="d-none d-md-table-cell">Hunger</th>
                <th className="d-none d-md-table-cell">Stress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {measures.map((measure) => (
                <tr key={measure._id} >
                  <td>
                    {measure.isEditing ? (
                      <DatePicker
                        id={`date-${measure._id}`}
                        dateFormat="dd/MM/yyyy"
                        className='form-control'
                        selected={new Date(measure.date)}
                        onChange={(date) => handleInputChange(measure._id, 'date', date, setMeasures)}
                      />
                    ) : (
                      new Date(measure.date).toLocaleDateString()
                    )}
                  </td>
                  <td>
                    {measure.isEditing ? (
                      <input
                        id={`weight-${measure._id}`}
                        className='form-control'
                        type="number"
                        value={measure.weight}
                        onChange={(e) => handleInputChange(measure._id, 'weight', e.target.value, setMeasures)}
                      />
                    ) : (
                      `${measure.weight} Kg`
                    )}
                  </td>
                  <td className="d-none d-md-table-cell">
                    {measure.isEditing ? (
                      <input
                        id={`steps-${measure._id}`}
                        className='form-control'
                        type="number"
                        value={measure.steps}
                        onChange={(e) => handleInputChange(measure._id, 'steps', e.target.value, setMeasures)}
                      />
                    ) : (
                      `${measure.steps}`
                    )}
                  </td>
                  <td className="d-none d-md-table-cell">
                    {measure.isEditing ? (
                      <input
                        id={`sleepHours-${measure._id}`}
                        className='form-control'
                        type="number"
                        value={measure.sleepHours}
                        onChange={(e) => handleInputChange(measure._id, 'sleepHours', e.target.value, setMeasures)}
                      />
                    ) : (
                      `${measure.sleepHours} Hours`
                    )}
                  </td>
                  <td className="d-none d-md-table-cell">
                    {measure.isEditing ? (
                      <select
                        id={`energy-${measure._id}`}
                        className='form-select'
                        value={measure.energy}
                        onChange={(e) => handleInputChange(measure._id, 'energy', e.target.value, setMeasures)}
                      >
                        {[1, 2, 3, 4, 5].map(value => (
                          <option key={value} value={value}>{value}</option>
                        ))}
                      </select>
                    ) : (
                      `${measure.energy}`
                    )}
                  </td>
                  <td className="d-none d-md-table-cell">
                    {measure.isEditing ? (
                      <select
                        id={`hunger-${measure._id}`}
                        className='form-select'
                        value={measure.hunger}
                        onChange={(e) => handleInputChange(measure._id, 'hunger', e.target.value, setMeasures)}
                      >
                        {[1, 2, 3, 4, 5].map(value => (
                          <option key={value} value={value}>{value}</option>
                        ))}
                      </select>
                    ) : (
                      `${measure.hunger}`
                    )}
                  </td>
                  <td className="d-none d-md-table-cell">
                    {measure.isEditing ? (
                      <select
                        id={`stress-${measure._id}`}
                        className='form-select'
                        value={measure.stress}
                        onChange={(e) => handleInputChange(measure._id, 'stress', e.target.value, setMeasures)}
                      >
                        {[1, 2, 3, 4, 5].map(value => (
                          <option key={value} value={value}>{value}</option>
                        ))}
                      </select>
                    ) : (
                      `${measure.stress}`
                    )}
                  </td>


                  <td>
                    {measure.isEditing ? (
                      <button className="btn btn-success mb-2 me-2" onClick={() => handleSaveMeasure(measure._id)}>Save</button>
                    ) : (
                      <button className="btn btn-warning mb-2 me-2" onClick={() => handleEditMeasure(measure._id)}>Edit</button>
                    )}
                    <button className="btn btn-danger mb-2" onClick={() => handleRemoveMeasure(measure._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {saveMeasureError && (
          <div className="alert alert-danger mt-2 d-table-cell" role="alert">
            {saveMeasureError}
          </div>
        )}

        <WeightChart measures={measures} />
      </div>

      <div style={{ display: isBodyMeasuresVisible ? 'block' : 'none' }}>
        {/* Display Measures when isMeasuresVisible is true */}
        <h2 className="mt-3">Measures</h2>
        <div className='table-responsive'>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight</th>
                <th>Peito</th>
                <th>Cintura</th>
                <th>Gluteo</th>
                <th>Braco Direito</th>
                <th>Braco Esquerdo</th>
                <th>Coxa Direita</th>
                <th>Coxa Esquerda</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Bodymeasures.map((bodymeasure) => (
                <tr key={bodymeasure._id} >
                  <td>
                    {bodymeasure.isEditing ? (
                      <DatePicker
                        id={`date-${bodymeasure._id}`}
                        dateFormat="dd/MM/yyyy"
                        className='form-control'
                        selected={new Date(bodymeasure.date)}
                        onChange={(date) => handleBodyInputChange(bodymeasure._id, 'date', date, setBodyMeasures)}
                      />
                    ) : (
                      new Date(bodymeasure.date).toLocaleDateString()
                    )}
                  </td>
                  <td>
                    {bodymeasure.isEditing ? (
                      <input
                        id={`weight-${bodymeasure._id}`}
                        className='form-control'
                        type="number"
                        value={bodymeasure.weight}
                        onChange={(e) => handleBodyInputChange(bodymeasure._id, 'weight', e.target.value, setBodyMeasures)}
                      />
                    ) : (
                      `${bodymeasure.weight} Kg`
                    )}
                  </td>
                  <td>
                    {bodymeasure.isEditing ? (
                      <input
                        id={`peito-${bodymeasure._id}`}
                        className='form-control'
                        type="number"
                        value={bodymeasure.peito}
                        onChange={(e) => handleBodyInputChange(bodymeasure._id, 'peito', e.target.value, setBodyMeasures)}
                      />
                    ) : (
                      `${bodymeasure.peito} Cm`
                    )}
                  </td>
                  <td>
                    {bodymeasure.isEditing ? (
                      <input
                        id={`cintura-${bodymeasure._id}`}
                        className='form-control'
                        type="number"
                        value={bodymeasure.cintura}
                        onChange={(e) => handleBodyInputChange(bodymeasure._id, 'cintura', e.target.value, setBodyMeasures)}
                      />
                    ) : (
                      `${bodymeasure.cintura} Cm`
                    )}
                  </td>
                  <td>
                    {bodymeasure.isEditing ? (
                      <input
                        id={`gluteo-${bodymeasure._id}`}
                        className='form-control'
                        type="number"
                        value={bodymeasure.gluteo}
                        onChange={(e) => handleBodyInputChange(bodymeasure._id, 'gluteo', e.target.value, setBodyMeasures)}
                      />
                    ) : (
                      `${bodymeasure.gluteo} Cm`
                    )}
                  </td>
                  <td>
                    {bodymeasure.isEditing ? (
                      <input
                        id={`bracoDrt-${bodymeasure._id}`}
                        className='form-control'
                        type="number"
                        value={bodymeasure.bracoDrt}
                        onChange={(e) => handleBodyInputChange(bodymeasure._id, 'bracoDrt', e.target.value, setBodyMeasures)}
                      />
                    ) : (
                      `${bodymeasure.bracoDrt} Cm`
                    )}
                  </td>
                  <td>
                    {bodymeasure.isEditing ? (
                      <input
                        id={`bracoEsq-${bodymeasure._id}`}
                        className='form-control'
                        type="number"
                        value={bodymeasure.bracoEsq}
                        onChange={(e) => handleBodyInputChange(bodymeasure._id, 'bracoEsq', e.target.value, setBodyMeasures)}
                      />
                    ) : (
                      `${bodymeasure.bracoEsq} Cm`
                    )}
                  </td>
                  <td>
                    {bodymeasure.isEditing ? (
                      <input
                        id={`coxaDireita-${bodymeasure._id}`}
                        className='form-control'
                        type="number"
                        value={bodymeasure.coxaDireita}
                        onChange={(e) => handleBodyInputChange(bodymeasure._id, 'coxaDireita', e.target.value, setBodyMeasures)}
                      />
                    ) : (
                      `${bodymeasure.coxaDireita} Cm`
                    )}
                  </td>
                  <td>
                    {bodymeasure.isEditing ? (
                      <input
                        id={`coxaEsquerda-${bodymeasure._id}`}
                        className='form-control'
                        type="number"
                        value={bodymeasure.coxaEsquerda}
                        onChange={(e) => handleBodyInputChange(bodymeasure._id, 'coxaEsquerda', e.target.value, setBodyMeasures)}
                      />
                    ) : (
                      `${bodymeasure.coxaEsquerda} Cm`
                    )}
                  </td>
                  <td>
                    {bodymeasure.isEditing ? (
                      <button className="btn btn-success mb-2 me-2" onClick={() => handleSaveBodyMeasure(bodymeasure._id)}>Save</button>
                    ) : (
                      <button className="btn btn-warning mb-2 me-2" onClick={() => handleEditBodyMeasure(bodymeasure._id)}>Edit</button>
                    )}
                    <button className="btn btn-danger mb-2" onClick={() => handleRemoveBodyMeasure(bodymeasure._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {saveBodyMeasureError && (
          <div className="alert alert-danger mt-2 d-table-cell" role="alert">
            {saveBodyMeasureError}
          </div>
        )}

      </div>

          <WorkoutsCards token={token}/>

      <div style={{ display: isAddWorkoutsVisible ? 'none' : 'block' }}>
        <h2 className="mt-3">Add Workout</h2>
        <WorkoutForm userId={userID} token={token} onCancel={toggleAddWorkout} />
      </div>

      <div style={{ display: isAddPhotosVisible ? 'none' : 'block' }}>
        <h2 className="mt-3">My Body</h2>
        <BodyPhotosUpload token={token} />
        <BodyPhotosGallery token={token} />
      </div>

    </div>
  );

}

export default Dashboard;