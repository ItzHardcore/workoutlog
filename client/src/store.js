// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userSlice';
import sessionsReducer from './reducers/sessionsSlice';
import workoutsReducer from './reducers/workoutsSlice';
import measuresReducer from './reducers/measuresSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        sessions: sessionsReducer,
        workouts: workoutsReducer,
        measures: measuresReducer,
    },
});

export default store;
