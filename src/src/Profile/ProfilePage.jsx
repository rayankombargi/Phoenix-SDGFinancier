// pages/ProfilePage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from '../components/NavBar';
import EditProfileModal from './EditProfileModal';
import './ProfilePage.css';

function ProfilePage() {
  const [user, setUser] = useState({
    avatar: 'https://via.placeholder.com/150',
    name: 'John Doe',
    email: 'johndoe@example.com',
    location: 'New York, USA',
    bio: 'Passionate about sustainable finance and eco-friendly spending. Always striving to improve both financial health and environmental impact.',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleEditSave = (updatedData) => {
    setUser(updatedData);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <NavBar />
      <motion.main
        className="profile-content container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="profile-card">
          <div className="profile-avatar">
            <img src={user.avatar} alt={`${user.name}'s avatar`} />
          </div>
          <div className="profile-details">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-email">{user.email}</p>
            <p className="profile-location">{user.location}</p>
            <p className="profile-bio">{user.bio}</p>
            <button
              className="edit-profile-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>
        <section className="profile-stats">
          <h2>Your Activity</h2>
          <p>
            Detailed analytics of your spending, savings, and sustainability impact will appear here.
          </p>
        </section>
      </motion.main>
      <AnimatePresence>
        {isEditing && (
          <EditProfileModal
            initialData={user}
            onSave={handleEditSave}
            onCancel={handleEditCancel}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProfilePage;
