import React, { useState } from 'react';
import './SignInForm.css'; // Create a CSS file for styling

const SignInForm = ({ handleClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    income: '',
    location: '',
    password: '',
    bio: '',
    image: null
  });

  const [errors, setErrors] = useState({});

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle image file upload
  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  // Password validation
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[0-9]).{9,25}$/;
    return regex.test(password);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must include a capital letter, a number, and be between 9-25 characters.';
    }

    // Further validation can be added here (e.g., username, email, etc.)

    if (Object.keys(newErrors).length === 0) {
      // Submit the form data (e.g., send it to a backend)
      alert('Form submitted!');
      handleClose(); // Close the modal
    } else {
      setErrors(newErrors); // Show errors
    }
  };

  return (
    <div className="sign-in-form-container">
      <form onSubmit={handleSubmit} className="sign-in-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="Enter username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Enter email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="income">Income</label>
          <input
            type="number"
            placeholder="Enter your income"
            name="income"
            value={formData.income}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            placeholder="Enter your location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            rows="3"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Upload Profile Image</label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>

        <button type="submit" className="submit-btn">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignInForm;
