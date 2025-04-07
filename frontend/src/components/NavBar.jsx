import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';
import Button from '../Dashboard/Button';

function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = Boolean(token);
  
  // Assume username and avatar are stored in localStorage; set defaults if not available
  const username = localStorage.getItem('username') || 'User';
  const defaultAvatar =
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
  const userAvatar = localStorage.getItem('avatar') || defaultAvatar;

  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    navigate('/profile');
  };

  const handleLogoutClick = () => {
    setShowDropdown(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
    navigate('/');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <h2 onClick={() => navigate('/')}>SDG Finance</h2>
        </div>

        <div className="navbar-links">
          <button onClick={() => navigate('/')}>Home</button>
          <button onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button onClick={() => navigate('/budget')}>Budget</button>
          <button onClick={() => navigate('/rewards')}>Rewards</button>
          <button onClick={() => navigate('/chatbot')}>ChatBot</button>
        </div>

        <div className="navbar-action">
          {isLoggedIn ? (
            <div className="profile-dropdown-container" ref={dropdownRef}>
              <button className="profile-button" onClick={toggleDropdown}>
                <img src={userAvatar} alt="Avatar" className="navbar-profile-avatar" />
                <span className="username-text">{username}</span>
                <span className="arrow">&#9662;</span>
              </button>
              <div className={`profile-dropdown ${showDropdown ? 'show' : ''}`}>
                <button className="dropdown-item" onClick={handleProfileClick}>
                  Profile
                </button>
                <button className="dropdown-item" onClick={handleLogoutClick}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            // Use our updated join button styling
            <button className="navbar-join-button" onClick={() => setShowJoinModal(true)}>
              Join Now
            </button>
          )}
        </div>
      </nav>

      {/* Join Now Modal for Logged Out Users */}
      {showJoinModal && (
        <div className="join-modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="join-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Welcome!</h3>
            <p>Please choose an option to continue:</p>
            <div className="join-modal-buttons">
              <Button
                text="Sign In"
                className="join-modal-signin-button"
                onClick={() => {
                  navigate('/login');
                  setShowJoinModal(false);
                }}
              />
              <Button
                text="Sign Up"
                className="join-modal-signup-button"
                onClick={() => {
                  navigate('/signup');
                  setShowJoinModal(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out from your account?</p>
            <div className="modal-buttons">
              <button className="btn modal-submit-btn" onClick={confirmLogout}>
                Yes
              </button>
              <button className="btn modal-cancel-btn" onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;