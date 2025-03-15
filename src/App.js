// src/App.js
import React from 'react';
import ChatButton from './components/ChatButton'; // Import the ChatButton component
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Your app content here */}
      {/* You can have your other components here, such as the Navbar, Footer, etc. */}

      {/* Include the ChatButton component to show the floating chat button on every page */}
      <ChatButton />
    </div>
  );
}

export default App;
