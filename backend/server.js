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

// Dummy in-memory storage for tracking user activity
const userActivity = new Map();

// Implement blocking mechanism for users who spam requests
const blockUserDuration = 60 * 60 * 1000; // 60 minutes in milliseconds
const maxRequestsBeforeBlock = 15;

// Implement user activity tracking middleware
app.use((req, res, next) => {
  const ipAddress = req.ip;

  // Track user activity
  if (!userActivity.has(ipAddress)) {
    userActivity.set(ipAddress, { requests: 0, lastRequestTime: Date.now() });
  }

  const user = userActivity.get(ipAddress);
  // Check if the user should be blocked
  if (user.requests >= maxRequestsBeforeBlock) {
    const timeSinceLastRequest = Date.now() - user.lastRequestTime;

    if (timeSinceLastRequest < blockUserDuration) {
      return res.status(429).json({ error: 'IP is blocked for ' + ((blockUserDuration - timeSinceLastRequest) / 60 / 1000).toFixed(0) + ' min. Please try again later.' });
    } else {
      // Reset user activity after the blocking duration
      userActivity.set(ipAddress, { requests: 0, lastRequestTime: Date.now() });
    }
  }

  // Update user activity
  user.requests += 1;
  user.lastRequestTime = Date.now();

  next();
});

app.post('/register', async (req, res) => {
  try {
    const { username, password, name, email, phoneNumber, repeatPassword, termsAccepted } = req.body;

    // Check for empty fields
    if (!username || !password || !name || !email || !phoneNumber || !repeatPassword || termsAccepted === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check for null values
    if (Object.values(req.body).includes(null)) {
      return res.status(400).json({ error: 'Null values are not allowed' });
    }

    // Validate phone number (only numbers, no strings)
    if (!(/^\d+$/.test(phoneNumber))) {
      return res.status(400).json({ error: 'Phone number must contain only numbers' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Check if the email is already taken
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Check if the phone is already taken
    const existingPhone = await User.findOne({ phoneNumber });
    if (existingPhone) {
      return res.status(400).json({ error: 'Phone already exists' });
    }

    // Define regex patterns for each criterion
    const upperCaseRegex = /[A-Z]/;
    const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const numberRegex = /[0-9]/;

    // Check each criterion
    if (!upperCaseRegex.test(password) || !symbolRegex.test(password) || !numberRegex.test(password) || password.length <= 8) {
      return res.status(400).json({ error: 'Password needs 1 uppercase letter, 1 symbol, 1 number, and length > 8 characters.' });
    }

    // Check if password and repeatPassword match
    if (password !== repeatPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      name,
      email,
      phoneNumber,
      termsAccepted,
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
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET);

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

// Update an existing workout
app.put('/workouts/:id', authenticateJWT, async (req, res) => {
  try {
    const workoutId = req.params.id;
    console.log('Workout ID:', workoutId);

    const workoutPayload = req.body;
    console.log('Received Payload:', workoutPayload);

    // Update exercises and series
    const exercisesPromises = workoutPayload.exercises.map(async (exercise) => {
      console.log('Updating Exercise:', exercise.exercise.name);

      const existingExercise = await Exercise.findOne({ name: exercise.exercise.name });

      if (!existingExercise) {
        console.error('Error finding exercise:', existingExercise);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      console.log('Found Exercise:', existingExercise);

      // Update Series instances or create new ones if needed
      const seriesPromises = exercise.series.map(async (series) => {
        if (series._id) {
          // If Series has an ID, update existing series
          await Series.findByIdAndUpdate(series._id, series);
          console.log('Updated Series:', series._id);
          return series._id;
        } else {
          // If Series doesn't have an ID, create a new series
          const newSeries = new Series(series);
          const savedSeries = await newSeries.save();
          console.log('Saved New Series:', savedSeries._id);
          return savedSeries._id;
        }
      });

      // Wait for all Series to be updated/created
      const seriesIds = await Promise.all(seriesPromises);
      console.log('Series IDs:', seriesIds);

      return {
        exerciseId: existingExercise._id,
        seriesIds,
      };
    });

    // Wait for all Exercises to be updated/created
    const exercisesData = await Promise.all(exercisesPromises);
    console.log('Exercises Data:', exercisesData);

    // Update the existing Workout instance
    await Workout.findByIdAndUpdate(workoutId, {
      name: workoutPayload.name,
      exercises: exercisesData.map((exerciseData) => ({
        exercise: exerciseData.exerciseId,
        series: exerciseData.seriesIds,
      })),
    });

    res.status(200).json({ message: 'Workout updated successfully' });
  } catch (error) {
    console.error('Error updating workout:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
