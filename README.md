# WorkoutLog App

WorkoutLog is a full-stack application designed to help you log and track your workouts. The app is built with a modern tech stack, including Node.js, Express.js, React, Redux, Styled Components, and MongoDB. It is deployed on Vercel and can be accessed [here](https://workoutlog-two.vercel.app).

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization
- Log workouts with details such as date, type, duration, and intensity
- View and manage logged workouts
- Responsive design

## Technologies Used

- **Frontend:**
  - React
  - Redux
  - Styled Components

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB

- **Deployment:**
  - Vercel

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Vercel account (for deployment)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-username/workoutlog.git
   cd workoutlog
   ```

2. **Install dependencies for the backend:**

   ```sh
   cd backend
   npm install
   ```

3. **Install dependencies for the frontend:**

   ```sh
   cd ../frontend
   npm install
   ```

## Configuration

1. **Backend:**

   Create a `.env` file in the `backend` directory and add the following:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

2. **Frontend:**

   Create a `.env` file in the `frontend` directory and add the following:

   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

## Usage

1. **Start the backend server:**

   ```sh
   cd backend
   npm start
   ```

   The backend server will run on `http://localhost:5000`.

2. **Start the frontend development server:**

   ```sh
   cd frontend
   npm start
   ```

   The frontend will run on `http://localhost:3000`.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

Thank you for checking out the WorkoutLog App! If you have any questions or feedback, feel free to reach out.
