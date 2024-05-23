import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMeasures, saveMeasure, removeMeasure, toggleEditMode, updateMeasure } from '../reducers/measuresSlice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import WeightChart from './WeightChart';

function MeasuresTable({ token }) {
    const dispatch = useDispatch();
    const measures = useSelector((state) => state.measures.measures);
    const error = useSelector((state) => state.measures.error);

    useEffect(() => {
        dispatch(fetchMeasures(token));
    }, [dispatch, token]);

    const handleInputChange = (measureId, field, value) => {
        dispatch(updateMeasure({ measureId, field, value }));
    };

    const handleSaveMeasure = (measureId) => {
        const measure = measures.find((m) => m._id === measureId);
        dispatch(saveMeasure({ measure, token }));
    };

    const handleEditMeasure = (measureId) => {
        dispatch(toggleEditMode(measureId));
    };

    const handleRemoveMeasure = (measureId) => {
        dispatch(removeMeasure({ measureId, token }));
    };

    return (
        <div style={{ display: 'block' }}>
            <h2 className="mt-3">My Daily Measures</h2>
            {measures.length === 0 ? (
                <h5 className="text-danger">You have no measures</h5>
            ) : (
                <div className="row gap-2">
                    <div className="col">
                        <div className='table-responsive' style={{ maxHeight: "392px" }}>
                            <table className="table table-striped">
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
                                                        <button className="btn btn-success mb-2 me-2" onClick={() => handleSaveMeasure(measure._id)}>
                                                            Save
                                                        </button>
                                                        <button className="btn btn-warning mb-2 me-2" onClick={() => handleEditMeasure(measure._id)}>
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button className="btn btn-warning mb-2 me-2" onClick={() => handleEditMeasure(measure._id)}>
                                                            Edit
                                                        </button>
                                                        <button className="btn btn-danger mb-2" onClick={() => handleRemoveMeasure(measure._id)}>
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {error && (
                            <div className="alert alert-danger mt-2" role="alert">
                                {error}
                            </div>
                        )}
                    </div>
                    <div className="col">
                        <WeightChart measures={measures} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default MeasuresTable;
