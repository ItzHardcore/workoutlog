// reducers/workoutsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const workoutsSlice = createSlice({
    name: 'workouts',
    initialState: { workouts: [] },
    reducers: {
        setWorkouts: (state, action) => {
            state.workouts = action.payload;
        },
        addWorkout: (state, action) => {
            state.workouts.push(action.payload);
        },
    },
});

export const { setWorkouts, addWorkout } = workoutsSlice.actions;
export default workoutsSlice.reducer;
