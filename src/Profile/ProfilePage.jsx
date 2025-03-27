// src/Profile/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EditProfileModal from './EditProfileModal';
import './ProfilePage.css';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../services/api';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getProfile();
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Unable to load profile. Please sign in.');
      }
    }
    fetchProfile();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const handleEditSave = async (updatedData) => {
    try {
      const res = await updateProfile(updatedData);
      setUser(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Profile update failed.');
    }
  };

  return (
    <div className="profile-page">
      {/* Banner Header */}
      <header className="profile-banner">
        <div className="banner-overlay">
          <h1>My Profile</h1>
        </div>
      </header>

      <main className="profile-content container">
        {error && <div className="error-message">{error}</div>}

        {user ? (
          <>
            {/* Profile Card */}
            <section className="profile-card">
              <div className="avatar-section">
                <img
                  src={user.image || 'https://via.placeholder.com/150'}
                  alt={`${user.username || 'User'}'s avatar`}
                  className="profile-avatar"
                />
              </div>
              <div className="profile-info">
                <h2 className="profile-name">{user.username || 'Guest'}</h2>
                <p className="profile-email">{user.email}</p>
                <p className="profile-location">
                  {user.location || 'No location'}
                </p>
                <p className="profile-bio">
                  {user.bio || 'This user has not written a bio yet.'}
                </p>
              </div>
              <div className="profile-actions">
                <button className="btn edit-btn" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
                <button className="btn signout-btn" onClick={handleSignOut}>
                  Log Out
                </button>
              </div>
            </section>

            {/* Example Stats Section */}
            <section className="profile-stats">
              <h2>Your Activity</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Expenses</h3>
                  <p>{user.expenseCount || 0}</p>
                </div>
                <div className="stat-card">
                  <h3>Budget Saved</h3>
                  <p>${user.budgetSaved || '0.00'}</p>
                </div>
                <div className="stat-card">
                  <h3>Eco Points</h3>
                  <p>{user.ecoPoints || 0}</p>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* Logged Out State */
          <section className="profile-placeholder">
  <h2>Welcome to Your Profile</h2>
  <p>
    Create an account or sign in to track your expenses, earn eco-points,
    and achieve your sustainability goals.
  </p>
  <button className="btn signin-btn" onClick={() => navigate('/login')}>
    Sign In
  </button>
  <button className="btn signup-btn" onClick={() => navigate('/signup')}>
    Sign Up
  </button>
</section>

        )}
      </main>

      <AnimatePresence>
        {isEditing && user && (
          <EditProfileModal
            initialData={user}
            onSave={handleEditSave}
            onCancel={() => setIsEditing(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProfilePage;
