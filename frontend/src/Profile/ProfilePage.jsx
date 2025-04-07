import React, { useState } from 'react';
import './ProfilePage.css';

function ProfilePage() {
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  // Default profile picture (silhouette image)
  const defaultAvatar =
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

  // Profile state with default avatar
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    location: 'New York, USA',
    bio: 'Passionate about sustainability and finance.',
    avatar: defaultAvatar,
  });

  // Goals state (each goal has an optional 'achieved' flag)
  const [goals, setGoals] = useState([
    { title: 'Save $5,000 by end of year', progress: '$2,500', achieved: false },
    { title: 'Donate $1,000 to charities', progress: '$300', achieved: false },
  ]);

  // Modal states
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [isEditGoalModalOpen, setIsEditGoalModalOpen] = useState(false);

  // New goal form state
  const [newGoal, setNewGoal] = useState({ title: '', progress: '' });

  // State for editing an existing goal
  const [editingGoalIndex, setEditingGoalIndex] = useState(null);
  const [editGoalData, setEditGoalData] = useState({ title: '', progress: '', achieved: false });

  /* ----------------------------------
     Profile Editing Handlers
  ------------------------------------- */
  const handleProfileInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, avatar: URL.createObjectURL(file) });
    }
  };

  const handleRemoveAvatar = () => {
    setProfile({ ...profile, avatar: defaultAvatar });
  };

  const handleEditProfileSubmit = (e) => {
    e.preventDefault();
    console.log('Profile updated:', profile);
    setIsEditProfileModalOpen(false);
    // Update backend if needed
  };

  /* ----------------------------------
     Add Goal Handlers
  ------------------------------------- */
  const handleAddGoalSubmit = (e) => {
    e.preventDefault();
    if (newGoal.title && newGoal.progress) {
      setGoals([...goals, { ...newGoal, achieved: false }]);
      setNewGoal({ title: '', progress: '' });
      setIsAddGoalModalOpen(false);
      console.log('Goal added:', newGoal);
      // Update backend if needed
    }
  };

  /* ----------------------------------
     Edit Goal Handlers
  ------------------------------------- */
  const openEditGoalModal = (index) => {
    setEditingGoalIndex(index);
    setEditGoalData(goals[index]);
    setIsEditGoalModalOpen(true);
  };

  const handleEditGoalInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditGoalData({
      ...editGoalData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleEditGoalSubmit = (e) => {
    e.preventDefault();
    const updatedGoals = [...goals];
    updatedGoals[editingGoalIndex] = editGoalData;
    setGoals(updatedGoals);
    setIsEditGoalModalOpen(false);
    console.log('Goal updated:', editGoalData);
    // Update backend if needed
  };

  const handleRemoveGoalInEdit = () => {
    if (window.confirm('Are you sure you want to remove this goal?')) {
      const updatedGoals = [...goals];
      updatedGoals.splice(editingGoalIndex, 1);
      setGoals(updatedGoals);
      setIsEditGoalModalOpen(false);
    }
  };

  /* ----------------------------------
     Logged Out Placeholder
  ------------------------------------- */
  if (!isLoggedIn) {
    return (
      <div className="profile-page">
        <div className="profile-placeholder">
          <h2>Please Sign In</h2>
          <p>You need to sign in to view your profile.</p>
          <button className="btn signin-btn" onClick={() => (window.location = '/login')}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  /* ----------------------------------
     Main Render
  ------------------------------------- */
  return (
    <div className="profile-page">
      {/* Top Banner */}
      <div className="profile-banner">
        <div className="banner-overlay"></div>
        <h1>My Finance Dashboard</h1>
        <p>Welcome to your personal finance portal</p>
      </div>

      {/* Dashboard Container */}
      <div className="profile-dashboard">
        {/* Left Column */}
        <div className="dashboard-left">
          {/* Profile Info Card */}
          <div className="profile-info-card glass-card">
            <div className="profile-info-header">
              <img src={profile.avatar} alt="Profile" className="profile-avatar" />
              <div>
                <h2 className="profile-name">{profile.name}</h2>
                <p className="profile-location">{profile.location}</p>
              </div>
            </div>
            <div className="profile-contact">
              <p className="profile-email">{profile.email}</p>
              <p className="profile-bio">{profile.bio}</p>
            </div>
            <button
              className="btn edit-profile-btn"
              onClick={() => setIsEditProfileModalOpen(true)}
            >
              Edit Profile
            </button>
          </div>

          {/* Achievements */}
          <div className="profile-achievements glass-card">
            <h2>Achievements</h2>
            <div className="badges-grid">
              {/* Square achievement #1 */}
              <div className="badge-card">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Eco Hero"
                  className="badge-icon"
                />
                <p className="badge-title">Eco Hero</p>
              </div>
              {/* Square achievement #2 */}
              <div className="badge-card">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Saver"
                  className="badge-icon"
                />
                <p className="badge-title">Saver</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="dashboard-right">
          {/* Stats */}
          <div className="profile-stats glass-card">
            <h2>My Stats</h2>
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

          {/* Goals & Milestones */}
          <div className="profile-goals glass-card">
            <h2>Goals & Milestones</h2>
            <div className="goals-list">
              {goals.map((goal, idx) => (
                <div className="goal-item" key={idx}>
                  <div className="goal-text">
                    <h4>{goal.title}</h4>
                    <p>Progress: {goal.progress}</p>
                    {goal.achieved && (
                      <p className="goal-achieved">Achieved</p>
                    )}
                  </div>
                  <div className="goal-buttons">
                    <button className="btn goal-edit-btn" onClick={() => openEditGoalModal(idx)}>
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="btn add-goal-btn"
              style={{ marginTop: '1rem' }}
              onClick={() => setIsAddGoalModalOpen(true)}
            >
              Add Goal
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Profile</h3>
            <form onSubmit={handleEditProfileSubmit} className="modal-form">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileInputChange}
                required
              />

              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileInputChange}
                required
              />

              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleProfileInputChange}
                required
              />

              <label>Bio:</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleProfileInputChange}
                required
              ></textarea>

              <label
                htmlFor="avatar-upload"
                style={{ cursor: 'pointer', color: 'var(--secondary)' }}
              >
                Change Profile Picture
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />

              <button
                type="button"
                className="btn modal-submit-btn"
                onClick={handleRemoveAvatar}
              >
                Remove Profile Picture
              </button>

              <div className="modal-buttons">
                <button type="submit" className="btn modal-submit-btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn modal-cancel-btn"
                  onClick={() => setIsEditProfileModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {isAddGoalModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Goal</h3>
            <form onSubmit={handleAddGoalSubmit} className="modal-form">
              <label>Goal Title:</label>
              <input
                type="text"
                placeholder="Goal Title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                required
              />

              <label>Progress:</label>
              <input
                type="text"
                placeholder="Progress"
                value={newGoal.progress}
                onChange={(e) => setNewGoal({ ...newGoal, progress: e.target.value })}
                required
              />

              <div className="modal-buttons">
                <button type="submit" className="btn modal-submit-btn">
                  Add Goal
                </button>
                <button
                  type="button"
                  className="btn modal-cancel-btn"
                  onClick={() => setIsAddGoalModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Goal Modal */}
      {isEditGoalModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Goal</h3>
            <form onSubmit={handleEditGoalSubmit} className="modal-form">
              <label>Goal Title:</label>
              <input
                type="text"
                name="title"
                value={editGoalData.title}
                onChange={handleEditGoalInputChange}
                required
              />

              <label>Progress:</label>
              <input
                type="text"
                name="progress"
                value={editGoalData.progress}
                onChange={handleEditGoalInputChange}
                required
              />

              <label>
                <input
                  type="checkbox"
                  name="achieved"
                  checked={editGoalData.achieved}
                  onChange={handleEditGoalInputChange}
                />{' '}
                Mark as Achieved
              </label>

              <div className="modal-buttons">
                <button type="submit" className="btn modal-submit-btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn modal-cancel-btn"
                  onClick={() => setIsEditGoalModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn modal-cancel-btn"
                  onClick={handleRemoveGoalInEdit}
                >
                  Remove Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;