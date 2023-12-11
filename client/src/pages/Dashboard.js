import CreateWorkout from '../components/CreateWorkout';

function Dashboard({ token, username, handleLogout }) {
  async function fetchWorkouts(token) {
    try {
      const response = await fetch('http://localhost:3001/workouts', {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  const createWorkout = () => <CreateWorkout token={token} handleLogout={handleLogout} />;

  return (
    <div>
      {createWorkout()}
      <h2>Dashboard</h2>
      <p>Welcome to the dashboard, {username}!</p>
      <p>You have token: {token}</p>
      <button onClick={() => fetchWorkouts(token)}>Fetch</button>
    </div>
  );
}

export default Dashboard;
