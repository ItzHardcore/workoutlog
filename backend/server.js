require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
var DateOnly = require('mongoose-dateonly')(mongoose);
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Schemas
const User = require('./schemas/User');
const Workout = require('./schemas/Workout');
const Series = require('./schemas/Series');
const Exercise = require('./schemas/Exercise');
const Measure = require('./schemas/Measure');
const WorkoutSession = require('./schemas/WorkoutSession');
const BodyPhoto = require('./schemas/BodyPhoto');
const BodyMeasure = require('./schemas/BodyMeasure');


const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3001;

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.pz22sm8.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(router);

// Dummy in-memory storage for tracking user activity
const userActivity = new Map();

// Implement blocking mechanism for users who spam requests
const blockUserDuration = 60 * 60 * 1000; // 60 minutes in milliseconds
const maxRequestsBeforeBlock = 15;

// Implement user activity tracking middleware
const registerSpamMiddleware = (req, res, next) => {
  const ipAddress = req.ip;

  // Track user activity
  if (!userActivity.has(ipAddress)) {
    userActivity.set(ipAddress, { requests: 0, lastRequestTime: Date.now() });
  }

  const user = userActivity.get(ipAddress);

  // Check if the user should be blocked
  console.log(user.requests);
  if (user.requests >= maxRequestsBeforeBlock) {
    const timeSinceLastRequest = Date.now() - user.lastRequestTime;

    if (timeSinceLastRequest < blockUserDuration) {
      return res.status(429).json({
        error: 'IP is blocked for ' + ((blockUserDuration - timeSinceLastRequest) / 60 / 1000).toFixed(0) + ' min. Please try again later.'
      });
    } else {
      // Reset user activity after the blocking duration
      userActivity.set(ipAddress, { requests: 0, lastRequestTime: Date.now() });
    }
  }

  // Update user activity
  user.requests += 1;
  user.lastRequestTime = Date.now();

  next();
};

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

// Serve static files from the 'media' folder
app.use('/media', express.static(path.join(__dirname, 'media')));

app.post('/register', registerSpamMiddleware, async (req, res) => {

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

    // Validate character limits
    const maxLength = 30;
    if (
      username.length > maxLength ||
      password.length > maxLength ||
      name.length > maxLength ||
      email.length > maxLength ||
      phoneNumber.length > maxLength ||
      repeatPassword.length > maxLength
    ) {
      return res.status(400).json({ error: 'Field length exceeds the maximum limit of 30 characters' });
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

    const defaultPhotoURL = 'http://localhost:3001/media/defaultUser.jpg';

    // Create a new user
    const newUser = new User({
      photo: defaultPhotoURL,
      username,
      password: hashedPassword,
      name,
      email,
      phoneNumber,
      termsAccepted,
      emailVerified: false,
      role: 'user',
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
  console.log("Login POST");
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

app.get('/profile', authenticateJWT, async (req, res) => {
  try {
    // Fetch user details from the database
    const userId = req.user.userId; // Assuming req.user has the user ID after authentication
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Only include necessary fields in the response
    const userProfile = {
      photo: user.photo,
      username: user.username,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      termsAccepted: user.termsAccepted,
      emailVerified: user.emailVerified,
      role: user.role,
    };

    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



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


app.post('/workoutSession', async (req, res) => {
  try {
    const { startDate, endDate, user, workoutName, exercises } = req.body;

    // Create a new WorkoutSession instance
    const workoutSession = new WorkoutSession({
      startDate,
      endDate,
      user,
      workoutName,
      exercises,
    });
    // Save the WorkoutSession to the database
    const savedWorkoutSession = await workoutSession.save();

    res.status(201).json(savedWorkoutSession); // Respond with the saved WorkoutSession
  } catch (error) {
    console.error('Error saving workout session:', error);
    res.status(500).json({ error: 'Failed to save workout session' }); // Respond with an error message
  }
});


app.get('/workoutSessions', authenticateJWT, async (req, res) => {
  try {
    // Retrieve workout sessions from the database
    const sessions = await WorkoutSession.find({ user: req.user.userId })
      .sort({ startDate: -1 })
      .limit(10);

    res.status(200).json(sessions); // Respond with the fetched workout sessions
  } catch (error) {
    console.error('Error fetching workout sessions:', error);
    res.status(500).json({ error: 'Failed to fetch workout sessions' }); // Respond with an error message
  }
});

app.get('/workoutSessions/:id', authenticateJWT, async (req, res) => {
  const sessionId = req.params.id;

  try {
    // Retrieve the workout session by its ID
    const session = await WorkoutSession.findById(sessionId)


    if (!session) {
      // If session is not found, return a 404 response
      return res.status(404).json({ error: 'Workout session not found' });
    }

    // If session is found, return it in the response
    res.json(session);
  } catch (error) {
    console.error('Failed to fetch workout session:', error);
    res.status(500).json({ error: 'Failed to fetch workout session' });
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

app.post('/measures', authenticateJWT, async (req, res) => {
  try {
    const { weight, steps, sleepHours, energy, hunger, stress, date } = req.body;

    // Assuming you have a user ID available in req.user
    const userId = req.user.userId;

    // Parse the input date to create the date range
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0); // Set time to 00:00:00
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1); // Adding one day to get the next day
    endDate.setHours(0, 0, 0, 0); // Set time to 00:00:00

    // Check if a measure with the same date range already exists for the user
    const existingMeasure = await Measure.findOne({
      user: userId,
      date: { $gte: startDate, $lt: endDate }
    });

    if (existingMeasure) {
      // If a measure with the same date already exists, throw an error
      return res.status(400).json({ error: 'A measure for this date already exists' });
    }

    // Create a new measure
    const newMeasure = new Measure({
      weight,
      steps,
      sleepHours,
      energy,
      hunger,
      stress,
      date,
      user: userId,
    });

    // Save the measure to the database
    const savedMeasure = await newMeasure.save();

    res.status(201).json(savedMeasure);
  } catch (error) {
    console.error('Error saving measures:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.delete('/measures/:id', authenticateJWT, async (req, res) => {
  try {
    const measureId = req.params.id;
    // Find the measure and ensure it belongs to the current user
    const measure = await Measure.findOne({ _id: measureId, user: req.user.userId });
    
    if (!measure) {
      return res.status(404).json({ error: 'Measure not found' });
    }

    // Delete the measure
    await Measure.deleteOne({ _id: measureId });

    res.status(200).json({ message: 'Measure deleted successfully' });
  } catch (error) {
    console.error('Error deleting measure:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get measures for the current user
app.get('/measures', authenticateJWT, async (req, res) => {
  try {
    // Fetch measures for the current user
    const userId = req.user.userId;
    const measures = await Measure.find({ user: userId }).sort({ date: -1 });

    res.status(200).json(measures);
  } catch (error) {
    console.error('Error fetching measures:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/measures/:measureId', authenticateJWT, async (req, res) => {
  try {
    const { measureId } = req.params;
    const { weight, steps, sleepHours, energy, hunger, stress, date } = req.body;

    // Assuming you have a user ID available in req.user
    const userId = req.user.userId;

    // Parse the input date to create the date range
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0); // Set time to 00:00:00
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1); // Adding one day to get the next day
    endDate.setHours(0, 0, 0, 0); // Set time to 00:00:00

    // Check if a measure with the same date range already exists for the user
    const existingMeasure = await Measure.findOne({
      user: userId,
      date: { $gte: startDate, $lt: endDate }
    });

    if (existingMeasure && existingMeasure._id.toString() !== measureId) {
      // If a measure with the same date already exists, throw an error
      return res.status(400).json({ error: 'A measure for this date already exists' });
    }

    // Find the measure to update
    const measureToUpdate = await Measure.findById(measureId);
    if (!measureToUpdate) {
      return res.status(404).json({ error: 'Measure not found' });
    }

    // Update the measure fields
    measureToUpdate.weight = weight;
    measureToUpdate.steps = steps;
    measureToUpdate.sleepHours = sleepHours;
    measureToUpdate.energy = energy;
    measureToUpdate.hunger = hunger;
    measureToUpdate.stress = stress;
    measureToUpdate.date = date;

    // Save the updated measure to the database
    const updatedMeasure = await measureToUpdate.save();

    res.status(200).json(updatedMeasure);
  } catch (error) {
    console.error('Error updating measure:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /bodymeasures endpoint to add a new body measure
app.post('/bodymeasures', authenticateJWT, async (req, res) => {
  try {
    const { date, fase, kcal, weight, peito, cintura, gluteo, bracoDrt, bracoEsq, coxaDireita, coxaEsquerda } = req.body;

    // Assuming you have a user ID available in req.user
    const userId = req.user.userId;

    // Parse the input date to create the date range
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0); // Set time to 00:00:00
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1); // Adding one day to get the next day
    endDate.setHours(0, 0, 0, 0); // Set time to 00:00:00

    // Check if a body measure with the same date range already exists for the user
    const existingBodyMeasure = await BodyMeasure.findOne({
      user: userId,
      date: { $gte: startDate, $lt: endDate }
    });

    if (existingBodyMeasure) {
      // If a body measure with the same date already exists, throw an error
      return res.status(400).json({ error: 'A body measure for this date already exists' });
    }

    // Create a new body measure
    const newBodyMeasure = new BodyMeasure({
      date,
      fase,
      kcal,
      weight,
      peito,
      cintura,
      gluteo,
      bracoDrt,
      bracoEsq,
      coxaDireita,
      coxaEsquerda,
      user: userId,
    });

    // Save the body measure to the database
    const savedBodyMeasure = await newBodyMeasure.save();

    res.status(201).json(savedBodyMeasure);
  } catch (error) {
    console.error('Error saving body measure:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /bodymeasures/:id endpoint to delete a body measure by ID
app.delete('/bodymeasures/:id', authenticateJWT, async (req, res) => {
  try {
    const bodyMeasureId = req.params.id;

    // Find the body measure and ensure it belongs to the current user
    const bodyMeasure = await BodyMeasure.findOne({ _id: bodyMeasureId, user: req.user.userId });

    if (!bodyMeasure) {
      return res.status(404).json({ error: 'Body measure not found' });
    }

    // Delete the body measure
    await BodyMeasure.deleteOne({ _id: bodyMeasureId });

    res.status(200).json({ message: 'Body measure deleted successfully' });
  } catch (error) {
    console.error('Error deleting body measure:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /bodymeasures endpoint to get all body measures for the current user
app.get('/bodymeasures', authenticateJWT, async (req, res) => {
  try {
    // Fetch body measures for the current user
    const userId = req.user.userId;
    const bodyMeasures = await BodyMeasure.find({ user: userId }).sort({ date: -1 });

    res.status(200).json(bodyMeasures);
  } catch (error) {
    console.error('Error fetching body measures:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT /bodymeasures/:bodyMeasureId endpoint to update a body measure by ID
app.put('/bodymeasures/:bodyMeasureId', authenticateJWT, async (req, res) => {
  try {
    const { bodyMeasureId } = req.params;
    const { date, fase, kcal, weight, peito, cintura, gluteo, bracoDrt, bracoEsq, coxaDireita, coxaEsquerda } = req.body;

    // Assuming you have a user ID available in req.user
    const userId = req.user.userId;

    // Parse the input date to create the date range
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0); // Set time to 00:00:00
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1); // Adding one day to get the next day
    endDate.setHours(0, 0, 0, 0); // Set time to 00:00:00

    // Check if a body measure with the same date range already exists for the user
    const existingBodyMeasure = await BodyMeasure.findOne({
      user: userId,
      date: { $gte: startDate, $lt: endDate }
    });

    if (existingBodyMeasure && existingBodyMeasure._id.toString() !== bodyMeasureId) {
      // If a body measure with the same date already exists, throw an error
      return res.status(400).json({ error: 'A body measure for this date already exists' });
    }

    // Find the body measure to update
    const bodyMeasureToUpdate = await BodyMeasure.findById(bodyMeasureId);
    if (!bodyMeasureToUpdate) {
      return res.status(404).json({ error: 'Body measure not found' });
    }

    // Update the body measure fields
    bodyMeasureToUpdate.date = date;
    bodyMeasureToUpdate.fase = fase;
    bodyMeasureToUpdate.kcal = kcal;
    bodyMeasureToUpdate.weight = weight;
    bodyMeasureToUpdate.peito = peito;
    bodyMeasureToUpdate.cintura = cintura;
    bodyMeasureToUpdate.gluteo = gluteo;
    bodyMeasureToUpdate.bracoDrt = bracoDrt;
    bodyMeasureToUpdate.bracoEsq = bracoEsq;
    bodyMeasureToUpdate.coxaDireita = coxaDireita;
    bodyMeasureToUpdate.coxaEsquerda = coxaEsquerda;

    // Save the updated body measure to the database
    const updatedBodyMeasure = await bodyMeasureToUpdate.save();

    res.status(200).json(updatedBodyMeasure);
  } catch (error) {
    console.error('Error updating body measure:', error);
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads/')); // Use relative path for destination
  },
  filename: function (req, file, cb) {
    const fileName = uuidv4(); // Generate a random filename
    const fileExtension = file.originalname.split('.').pop(); // Get the file extension
    cb(null, `${fileName}.${fileExtension}`); // Set the filename with the extension
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

app.post('/upload-body-photo',authenticateJWT , upload.single('photoFile'), async (req, res) => {
  console.log(req);
  try {
    // Attempt to handle file upload
    if (req.file) {
      const fileName = req.file.filename;

      const bodyPhoto = new BodyPhoto({
        user: req.user.userId, // Assuming the userId is extracted from the JWT token
        frontImage: fileName,
        weight: req.body.weight, // Convert weight to number
        date: req.body.date // Convert date to Date object
      });

      const savedBodyPhoto = await bodyPhoto.save();
      return res.status(201).json(savedBodyPhoto);
    }

    // Attempt to handle base64 data upload
    if (req.body.photo) {
      const base64Data = req.body.photo;
      const decodedImage = Buffer.from(base64Data, 'base64');
      const fileName = uuidv4() + '.jpg';
      const filePath = path.join(__dirname, 'uploads', fileName);

      fs.writeFileSync(filePath, decodedImage);

      const bodyPhoto = new BodyPhoto({
        user: req.user.userId, // Assuming the userId is extracted from the JWT token
        frontImage: fileName,
        weight: req.body.weight, // Convert weight to number
        date: req.body.date // Convert date to Date object
      });

      const savedBodyPhoto = await bodyPhoto.save();
      return res.status(201).json(savedBodyPhoto);
    }

    // If neither file nor base64 data was provided
    return res.status(400).json({ error: 'No photo file or data was provided.' });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return res.status(500).json({ error: 'Failed to upload photo.' });
  }
});



app.get('/uploads/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', filename);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // If the file exists, send it in the response
    res.sendFile(filePath);
  } else {
    // If the file doesn't exist, return a 404 error
    res.status(404).send('File not found');
  }
});

app.get('/photos', authenticateJWT, async (req, res) => {
  try {
    // Assuming you have a user ID available in req.user
    const userId = req.user.userId;

    // Find all body photos for the user
    const photos = await BodyPhoto.find({ user: userId });

    // Extract relevant data for each photo
    const photosData = photos.map(photo => ({
      frontImage: photo.frontImage,
      backImage: photo.backImage,
      leftImage: photo.leftImage,
      rightImage: photo.rightImage,
      weight: photo.weight,
      date: photo.date
    }));

    console.log(photosData);
    res.json(photosData);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
