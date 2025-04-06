import React from 'react';
import './ProfilePage.css';

function ProfilePage() {
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  // If the user is not logged in, you might show a placeholder:
  if (!isLoggedIn) {
    return (
      <div className="profile-page">
        <div className="profile-placeholder">
          <h2>Please Sign In</h2>
          <p>You need to sign in to view your profile.</p>
          <button className="btn signin-btn" onClick={() => window.location = '/login'}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-banner">
        <div className="banner-overlay"></div>
        <h1>Profile</h1>
      </div>

      {/* Use a specific container class for the profile page */}
      <div className="profile-container">
        <div className="profile-card">
          <div className="avatar-section">
            <img
              src="https://via.placeholder.com/140"
              alt="Profile"
              className="profile-avatar"
            />
          </div>
          <div className="profile-info">
            <h2 className="profile-name">John Doe</h2>
            <p className="profile-email">johndoe@example.com</p>
            <p className="profile-location">New York, USA</p>
            <p className="profile-bio">Passionate about sustainability and finance.</p>
          </div>
          <div className="profile-actions">
            <button className="btn edit-btn">Edit Profile</button>
          </div>
        </div>

        <div className="profile-stats">
          <h2>Stats</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Savings</h3>
              <p>$1,250</p>
            </div>
            <div className="stat-card">
              <h3>Donations</h3>
              <p>$350</p>
            </div>
          </div>
        </div>

        <div className="profile-achievements">
          <h2>Achievements</h2>
          <div className="badges-grid">
            <div className="badge-card">
              <img
                src="https://via.placeholder.com/60"
                alt="Badge"
                className="badge-icon"
              />
              <p className="badge-title">Eco Hero</p>
            </div>
            <div className="badge-card">
              <img
                src="https://via.placeholder.com/60"
                alt="Badge"
                className="badge-icon"
              />
              <p className="badge-title">Saver</p>
            </div>
          </div>
        </div>

        <div className="profile-goals">
          <h2>Goals & Milestones</h2>
          <div className="goals-list">
            <div className="goal-item">
              <h4>Save $5,000 by end of year</h4>
              <p>Progress: $2,500</p>
            </div>
            <div className="goal-item">
              <h4>Donate $1,000 to charities</h4>
              <p>Progress: $300</p>
            </div>
          </div>
          <button className="btn add-goal-btn">Add Goal</button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;