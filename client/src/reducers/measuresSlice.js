// reducers/measuresSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = require('../components/baseUrl');

export const fetchMeasures = createAsyncThunk(
    'measures/fetchMeasures',
    async (token, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/measures`, {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch measures');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createMeasure = createAsyncThunk(
    'measures/createMeasure',
    async ({ measuresData, token }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/measures`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
                body: JSON.stringify(measuresData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to save measures. Please try again.');
            }

            // If the response is OK, return the data
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const saveMeasure = createAsyncThunk(
    'measures/saveMeasure',
    async ({ measure, token }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/measures/${measure._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
                body: JSON.stringify(measure),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save measure');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeMeasure = createAsyncThunk(
    'measures/removeMeasure',
    async ({ measureId, token }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/measures/${measureId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to remove measure');
            }
            return measureId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const measuresSlice = createSlice({
    name: 'measures',
    initialState: {
        measures: [],
        error: null,
    },
    reducers: {
        toggleEditMode: (state, action) => {
            const measureIndex = state.measures.findIndex(measure => measure._id === action.payload);
            if (measureIndex !== -1) {
                state.measures[measureIndex].isEditing = !state.measures[measureIndex].isEditing;
            }
        },
        updateMeasure: (state, action) => {
            const { measureId, field, value } = action.payload;
            const measureIndex = state.measures.findIndex(measure => measure._id === measureId);
            if (measureIndex !== -1) {
                state.measures[measureIndex][field] = value;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMeasures.fulfilled, (state, action) => {
                state.measures = action.payload;
                state.error = null;
            })
            .addCase(fetchMeasures.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(saveMeasure.fulfilled, (state, action) => {
                const index = state.measures.findIndex(measure => measure._id === action.payload._id);
                if (index !== -1) {
                    state.measures[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(saveMeasure.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(removeMeasure.fulfilled, (state, action) => {
                state.measures = state.measures.filter(measure => measure._id !== action.payload);
                state.error = null;
            })
            .addCase(removeMeasure.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(createMeasure.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.measures.push(action.payload);
                state.measures.sort((a, b) => new Date(b.date) - new Date(a.date));
            })
            .addCase(createMeasure.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { toggleEditMode, updateMeasure } = measuresSlice.actions;

export default measuresSlice.reducer;