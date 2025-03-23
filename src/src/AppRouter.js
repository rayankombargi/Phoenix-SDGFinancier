// src/AppRouter.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./HomePage";
import Dashboard from "./Dashboard/Dashboard";
import Budget from "./Budget/BudgetPage";
import Profile from "./Profile/ProfilePage";
import Signin from "./Profile/SignInForm";
import Signup from "./Profile/SignUpForm";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
