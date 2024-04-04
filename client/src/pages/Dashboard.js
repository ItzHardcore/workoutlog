import React, { useState, useEffect } from 'react';
import WorkoutForm from '../components/WorkoutForm';
import MeasuresForm from '../components/MeasuresForm';
import BodyMeasuresForm from '../components/BodyMeasuresForm';
import { jwtDecode } from 'jwt-decode';
import DatePicker from 'react-datepicker';
import BodyPhotosUpload from '../components/BodyPhotosUpload';
import BodyPhotosGallery from '../components/BodyPhotosGallery';

import SessionsCards from '../components/SessionsCards';
import WorkoutsCards from '../components/WorkoutsCards';
import TimerPopup from '../components/TimerPopup';
import MeasuresTable from '../components/MeasuresTable';

function Dashboard({ token }) {
  const [Bodymeasures, setBodyMeasures] = useState([]);
  const [isBodyMeasuresVisible, setIsBodyMeasuresVisible] = useState(false);
  const [isAddWorkoutsVisible, setAddIsWorkoutsVisible] = useState(true);
  const [isAddPhotosVisible, setAddIsPhotosVisible] = useState(true);
  const [isAddMeasuresVisible, setAddIsMeasuresVisible] = useState(false);
  const [isAddMoreMeasuresVisible, setAddMoreIsMeasuresVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [userID, setUserID] = useState('');

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
  }, [token]);

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

  const toggleBodyMeasures = async () => {
    if (!isBodyMeasuresVisible) {
      // Fetch measures when measures are becoming visible
      await fetchBodyMeasures(token);
    }
    setIsBodyMeasuresVisible((prev) => !prev);
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

      <button className="btn btn-secondary ms-2 mb-2" onClick={toggleBodyMeasures}>Toggle Body Measures</button>
      <button className="btn btn-success ms-2 mb-2" onClick={toggleAddWorkout}>Add Workout</button>
      <button className="btn btn-success ms-2 mb-2" onClick={toggleAddMeasures}>Add Measures</button>
      <button className="btn btn-success ms-2 mb-2" onClick={toggleAddMoreMeasures}>Body Measures</button>
      <button className="btn btn-success ms-2 mb-2" onClick={toggleVisibilityPhotos}>Add Photos</button>
      <TimerPopup />
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

      <WorkoutsCards token={token} />
      <MeasuresTable token={token} />
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