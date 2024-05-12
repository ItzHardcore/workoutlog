import React, { useState, useEffect } from 'react';
import "./profile.css"
const Profile = ({ token }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data from the server
    const fetchUserData = async () => {
      try {
        const response = await fetch('${REACT_APP_BACKEND_URL}/profile', {
          method: 'GET',
          headers: {
            'Authorization': `${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [token]);

  const handleEditProfile = () => {
    // Handle the logic for editing the profile
    console.log('Edit profile button clicked');
  };

  const handleEditPassword = () => {
    // Handle the logic for editing the password
    console.log('Edit password button clicked');
  };

  if (!user) {
    // Display a loading indicator or return null while waiting for user data
    return <p>Loading...</p>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center"> {/* Horizontally center the col*/}
        <div className="col">
          <div className="float-end rounded-circle profile-image mt-3 mb-5 me-5" onClick={() => console.log('Image clicked')}>
            <img
              src={user.photo}
              alt="Profile"
              className="img-fluid"
            />
            <div className="edit-icon">
              💾
            </div>
          </div>
        </div>
        <div className="col">
          <h2>{user.name}</h2>
          <p>@{user.username}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phoneNumber}</p>
          <p>Email Verified: {user.emailVerified ? 'Yes' : 'No'}</p>

          <button className="btn btn-primary" onClick={handleEditProfile}>
            Edit Profile
          </button>
          <button className="btn btn-secondary ms-3" onClick={handleEditPassword}>
            Edit Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
