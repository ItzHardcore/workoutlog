// actions/index.js
export const setSessions = (sessions) => ({
    type: 'SET_SESSIONS',
    payload: sessions,
});

export const addSession = (session) => ({
    type: 'ADD_SESSION',
    payload: session,
});

export const setWorkouts = (workouts) => ({
    type: 'SET_WORKOUTS',
    payload: workouts,
});

export const addWorkout = (workout) => ({
    type: 'ADD_WORKOUT',
    payload: workout,
});

export const setMeasures = (measures) => ({
    type: 'SET_MEASURES',
    payload: measures,
});

export const addMeasure = (measure) => ({
    type: 'ADD_MEASURE',
    payload: measure,
});

export const setUser = (username) => ({
    type: 'SET_USER',
    payload: username,
});
