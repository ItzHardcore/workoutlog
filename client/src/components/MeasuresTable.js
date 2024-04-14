import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import WeightChart from './WeightChart';

function MeasuresTable({ token }) {
    const [measures, setMeasures] = useState([]);
    const [saveMeasureError, setSaveMeasureError] = useState(null);

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
        } catch (error) {
            console.error('Failed to fetch measures:', error);
            setSaveMeasureError('Failed to fetch measures');
        }
    };

    useEffect(() => {
        fetchMeasures(token);
    }, [token]);


    const handleInputChange = (measureId, field, value, setter) => {
        const measureIndex = measures.findIndex((measure) => measure._id === measureId);
        if (measureIndex !== -1) {
            const updatedMeasures = [...measures];
            updatedMeasures[measureIndex] = {
                ...updatedMeasures[measureIndex],
                [field]: value, // Update the field value
            };
            setMeasures(updatedMeasures);
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
                isEditing: !updatedMeasures[measureIndex].isEditing // Toggle isEditing property
            };

            // Update the state with the measures array with the edited measure
            setMeasures(updatedMeasures);
        }
    };

    const handleRemoveMeasure = async (measureId) => {
        // Find the index of the measure to remove
        const measureIndex = measures.findIndex((measure) => measure._id === measureId);
        if (measureIndex !== -1) {
            if (measures[measureIndex].isEditing) {
                // If in edit mode, exit edit mode
                toggleEditMode(measureId);
            } else {
                // Show the confirmation dialog only if not in edit mode
                const isConfirmed = window.confirm('Are you sure you want to delete this measure?');

                // If the user clicks "OK" in the confirmation dialog, proceed with removal
                if (isConfirmed) {
                    try {
                        console.log(measureId);
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
            }
        }
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

    return (
        <div style={{ display: 'block' }}>
            <h2 className="mt-3">My Daily Measures</h2>
            {measures.length === 0 ? (
                <h5 className="text-danger">You have no measures</h5>
            ) : (
                <div className="row gap-5">
                    <div className="col">
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
                                                        onChange={(date) => handleInputChange(measure._id, 'date', date)}
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
                                                        onChange={(e) => handleInputChange(measure._id, 'weight', e.target.value)}
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
                                                        onChange={(e) => handleInputChange(measure._id, 'steps', e.target.value)}
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
                                                        onChange={(e) => handleInputChange(measure._id, 'sleepHours', e.target.value)}
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
                                                        onChange={(e) => handleInputChange(measure._id, 'energy', e.target.value)}
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
                                                        onChange={(e) => handleInputChange(measure._id, 'hunger', e.target.value)}
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
                                                        onChange={(e) => handleInputChange(measure._id, 'stress', e.target.value)}
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
                                                    <>
                                                        <button className="btn btn-success mb-2 me-2" onClick={() => handleSaveMeasure(measure._id)}>Save</button>
                                                        <button className="btn btn-warning mb-2 me-2" onClick={() => handleEditMeasure(measure._id)}>Cancel</button> {/* Change to Cancel button */}
                                                    </>
                                                ) : (
                                                    <>
                                                        <button className="btn btn-warning mb-2 me-2" onClick={() => handleEditMeasure(measure._id)}>Edit</button>
                                                        <button className="btn btn-danger mb-2" onClick={() => handleRemoveMeasure(measure._id)}>Delete</button>
                                                    </>
                                                )}

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {saveMeasureError && (
                            <div className="alert alert-danger mt-2" role="alert">
                                {saveMeasureError}
                            </div>
                        )}
                    </div>
                    <div className="col-4">
                        <WeightChart measures={measures} />
                    </div>
                </div>
            )}

        </div>
    );
}

export default MeasuresTable;
