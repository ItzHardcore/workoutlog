require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Schemas
const User = require('./schemas/User');
const Workout = require('./schemas/Workout');
const Series = require('./schemas/Series');
const Exercise = require('./schemas/Exercise');

const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3001;

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.pz22sm8.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(router);

// Register User
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the username is already taken
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Login User and generate JWT
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        // Create and sign a JWT token
        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '900s' });

        res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

app.get('/workouts', authenticateJWT, async (req, res) => {
    try {
        // Fetch workouts for the current user
        const userId = new ObjectId(req.user.userId);
        const workouts = await Workout.find({ user: userId })
            .populate('exercises.exercise') // Populate only the exercise field
            .populate('exercises.series')
            .exec();

        res.status(200).json(workouts);
    } catch (error) {
        console.error('Error fetching workouts:', error); // Log any errors
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE endpoint to remove a workout
app.delete('/workouts/:workoutId', authenticateJWT, async (req, res) => {
    try {
      const workoutId = req.params.workoutId;
      // Check if the workout belongs to the authenticated user
      const workout = await Workout.findOne({ _id: workoutId, user: req.user.userId });

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    // Remove the workout
    await Workout.deleteOne({ _id: workoutId });
  
      res.json({ message: 'Workout removed successfully' });
    } catch (error) {
      console.error('Error removing workout:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.get('/workouts/:workoutId', authenticateJWT, async (req, res) => {
  try {
    const workoutId = req.params.workoutId;
    const userId = req.user.userId; // Assuming you're using middleware to attach the user ID from the JWT

    // Check if the workout belongs to the authenticated user
    const workout = await Workout.findOne({ _id: workoutId, user: userId })
      .populate('exercises.exercise') // Assuming you want to populate the 'exercise' field
      .populate('exercises.series'); // Assuming you want to populate the 'series' field

    if (!workout) {
      // Workout not found or doesn't belong to the authenticated user
      return res.status(404).json({ error: 'Workout not found' });
    }

    // Send the workout data to the client
    res.status(200).json(workout);
  } catch (error) {
    console.error('Error fetching workout:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/exercises', authenticateJWT, async (req, res) => {
    try {
        // Fetch exercises for the current user
        const exercises = await Exercise.find();

        res.status(200).json(exercises);
    } catch (error) {
        console.error('Error fetching exercises:', error); // Log any errors
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/workouts', authenticateJWT, async (req, res) => {
    try {
        const workoutPayload = req.body;

        // Create exercises and series
        const exercisesPromises = workoutPayload.exercises.map(async (exercise) => {
            const existingExercise = await Exercise.findOne({ name: exercise.exercise.name });

            if (!existingExercise) {
                console.error('Error finding exercise:', existingExercise);
                res.status(500).json({ error: 'Internal Server Error' });
            }
          // Create Series instances
          const seriesPromises = exercise.series.map(async (series) => {
            const newSeries = new Series(series);
            // Save Series to get its ID
            const savedSeries = await newSeries.save();
            return savedSeries._id; // Return the Series ID
          });
    
          // Wait for all Series to be saved
          const seriesIds = await Promise.all(seriesPromises);
    
          return {
            exerciseId: existingExercise._id,
            seriesIds,
          };
        });
    
        // Wait for all Exercises to be saved
        const exercisesData = await Promise.all(exercisesPromises);
    
        // Create a new Workout instance
        const newWorkout = new Workout({
          name: workoutPayload.name,
          user: req.user.userId,
          exercises: exercisesData.map((exerciseData) => ({
            exercise: exerciseData.exerciseId,
            series: exerciseData.seriesIds,
          })),
        });
    
        // Save the Workout to the database
        await newWorkout.save();
  
      res.status(201).json({ message: 'Workout saved successfully' });
    } catch (error) {
      console.error('Error saving workout:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
