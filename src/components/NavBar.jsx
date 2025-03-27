// src/components/NavBar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  const navigate = useNavigate();
  const [showRestrictionMessage, setShowRestrictionMessage] = useState(false);
  const [messagePosition, setMessagePosition] = useState({ x: 0, y: 0 });

  const token = localStorage.getItem('token');
  const isLoggedIn = Boolean(token);

  const handleProtectedLink = (e, route) => {
    if (!isLoggedIn) {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      setMessagePosition({ x: rect.left, y: rect.bottom });
      setShowRestrictionMessage(true);
    } else {
      navigate(route);
    }
  };

  const hideRestrictionMessage = () => setShowRestrictionMessage(false);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button onClick={() => navigate('/')}>Home</button>
        <button onClick={(e) => handleProtectedLink(e, '/dashboard')}>Dashboard</button>
        <button onClick={(e) => handleProtectedLink(e, '/budget')}>Budget</button>
        <button onClick={(e) => handleProtectedLink(e, '/rewards')}>Rewards</button>
        <button onClick={(e) => handleProtectedLink(e, '/chatbot')}>ChatBot</button>
      </div>

      <div className="navbar-right">
        <button onClick={() => navigate('/profile')}>Profile</button>
        {isLoggedIn && <button onClick={handleSignOut}>Log Out</button>}
      </div>

      {showRestrictionMessage && (
        <div
          className="restriction-message"
          style={{ position: 'absolute', left: messagePosition.x, top: messagePosition.y + 8 }}
        >
          <p>Please sign in to access this feature.</p>
          <button onClick={() => { hideRestrictionMessage(); navigate('/login'); }}>Sign In</button>
          <button onClick={hideRestrictionMessage}>Cancel</button>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
