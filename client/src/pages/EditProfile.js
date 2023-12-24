import React, { useState, useEffect } from 'react';

const EditProfile = () => {
  // Example state, replace with your actual user data
  const [userProfile, setUserProfile] = useState({
    username: 'JohnDoe',
    email: 'john@example.com',
    // Add other user profile fields as needed
  });

  const [formData, setFormData] = useState({
    newUsername: '',
    newEmail: '',
    // Add other form fields as needed
  });

  useEffect(() => {
    // Set form data when the component mounts to show the current user data
    setFormData({
      newUsername: userProfile.username,
      newEmail: userProfile.email,
      // Add other form fields as needed
    });
  }, [userProfile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your API call or state update logic to save the edited profile
    // For example, you can dispatch an action to update the user profile in a global state
    console.log('Updated Profile:', formData);
  };

  return (
    <div className="container mt-5">
        
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            name="newUsername"
            value={formData.newUsername}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="newEmail"
            value={formData.newEmail}
            onChange={handleChange}
          />
        </div>
        {/* Add other form fields as needed */}
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
