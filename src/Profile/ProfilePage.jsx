import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "../components/NavBar";
import EditProfileModal from "./EditProfileModal";
import "./ProfilePage.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { p } from "framer-motion/client";

function ProfilePage() {
  const [user, setUser] = useState(null); // User starts as null (guest)
  const [isEditing, setIsEditing] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false); // For controlling the sign-in modal

  let navigate = useNavigate();

  const handleSignIn = (data) => {
    setUser(data); // Save the user data after sign-in
    setIsSigningIn(false); // Close the sign-in modal
  };

  const handleSignOut = () => {
    setUser(null); // Clear user data on log out
  };

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
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="profile-card">
          <div className="profile-avatar">
            {user && (
              <div className="avatar-container">
                <img
                  src={user ? user.image : "https://via.placeholder.com/150"}
                  alt={`${user ? user.username : "Guest"}'s avatar`}
                />
                <div className="profile-details">
                  <h1 className="profile-name">
                    {user ? user.username : "Guest"}
                  </h1>
                  <p className="profile-email">
                    {user ? user.email : "Not signed in"}
                  </p>
                  <p className="profile-location">
                    {user ? user.location : "Not signed in"}
                  </p>
                  <p className="profile-bio">
                    {user ? user.bio : "Not signed in"}
                  </p>
                </div>
              </div>
            )}
            {!user && <h2>Please SignUp/Login into your profile</h2>}

            {/* Edit Profile button is only shown when user is signed in */}
            {user && (
              <button
                className="edit-profile-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}

            {/* Show Sign In/Log In button if user is not signed in, Log Out button if user is signed in */}
            <button
              className="sign-in-btn"
              onClick={
                user
                  ? handleSignOut
                  : () => {
                      navigate("/signup");
                      setIsSigningIn(true);
                    }
              }
            >
              {user ? "Log Out" : "Sign up"}
            </button>
            <button
              className="sign-in-btn"
              onClick={
                user
                  ? handleSignOut
                  : () => {
                      navigate("/login");
                      setIsSigningIn(true);
                    }
              }
            >
              {user ? "Log Out" : "Sign in"}
            </button>
          </div>
        </div>
        <section className="profile-stats">
          <h2>Your Activity</h2>
          <p>
            Detailed analytics of your spending, savings, and sustainability
            impact will appear here.
          </p>
        </section>
      </motion.main>

      {/* Modal to Edit Profile */}
      <AnimatePresence>
        {isEditing &&
          user && ( // Only show the modal if user data exists
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