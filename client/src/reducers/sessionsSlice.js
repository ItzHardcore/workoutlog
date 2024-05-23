// reducers/sessionsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const sessionsSlice = createSlice({
    name: 'sessions',
    initialState: { sessions: [] },
    reducers: {
        setSessions: (state, action) => {
            state.sessions = action.payload;
        },
        addSession: (state, action) => {
            state.sessions.push(action.payload);
        },
    },
});

export const { setSessions, addSession } = sessionsSlice.actions;
export default sessionsSlice.reducer;
