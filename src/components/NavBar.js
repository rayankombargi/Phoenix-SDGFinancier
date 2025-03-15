// src/components/NavBar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './NavBar.css'; // Ensure to import the correct CSS file

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo and App Name */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="/logo.webp" alt="SDG Finance Logo" className="navbar-logo-img" /> {/* Correct path to logo */}
          <span className="app-name">SDG Finance</span> {/* App name next to the logo */}
        </Link>
        {/* Mobile Menu Icon */}
        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
        {/* Navigation Links */}
        <ul className={menuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/dashboard" className="nav-links" onClick={closeMenu}>
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/budget" className="nav-links" onClick={closeMenu}>
              Budget
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className="nav-links" onClick={closeMenu}>
              Profile
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
