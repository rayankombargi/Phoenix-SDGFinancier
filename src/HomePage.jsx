// HomePage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import SummaryCards from './components/SummaryCards';
import SDGPreview from './components/SDGPreview';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';

function Homepage() {
  return (
    <div className="homepage">
      <NavBar />

      {/* Hero Section with a faster scaling animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <HeroSection />
      </motion.div>

      {/* Features Section slides up quickly */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <FeaturesSection />
      </motion.div>

      {/* Summary Cards zoom in faster */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <SummaryCards />
      </motion.div>

      {/* SDG Preview slides in quickly from the left */}
      <motion.div
        initial={{ x: -150, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <SDGPreview />
      </motion.div>

      {/* Call To Action slides in quickly from below */}
      <motion.div
        initial={{ y: 150, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <CallToAction />
      </motion.div>

      <Footer />
    </div>
  );
}

export default Homepage;
