import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './Chatbot.css';

function ChatBot() {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: 'Welcome to the SDG Finance ChatBot! Ask me anything about sustainable finance, or upload an image of a product or receipt to analyze its sustainability.' }
  ]);
  const chatHistoryRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const newHistory = [...chatHistory, { sender: 'user', text: userMessage }];
    setChatHistory(newHistory);

    try {
      const response = await axios.post('/api/chatbot', { message: userMessage });
      const reply = response.data.reply;
      setChatHistory([...newHistory, { sender: 'bot', text: reply }]);
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
      setChatHistory([...newHistory, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    }

    setUserMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    // Display image preview and simulate chat from user
    const imageURL = URL.createObjectURL(file);
    setChatHistory((prev) => [...prev, { sender: 'user', image: imageURL }]);

    try {
      const response = await axios.post('/api/chatbot', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const reply = response.data.reply;
      setChatHistory((prev) => [...prev, { sender: 'bot', text: reply }]);
    } catch (error) {
      console.error('Image upload error:', error);
      setChatHistory((prev) => [...prev, { sender: 'bot', text: 'Sorry, failed to analyze the image.' }]);
    }
  };

  return (
    <div className="wrapper">
      <div className="chatbot-section">
        <motion.div 
          className="chatbot-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="chatbot-title">SDG Finance ChatBot</h2>
          <div className="chat-history" ref={chatHistoryRef}>
            {chatHistory.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.text && <p>{msg.text}</p>}
                {msg.image && (
                  <img src={msg.image} alt="Uploaded" style={{ maxWidth: '200px', borderRadius: '12px', marginTop: '0.5rem' }} />
                )}
              </div>
            ))}
          </div>

          <div className="chat-input-container">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="chat-input"
            />
            <button onClick={handleSendMessage} className="send-button">Send</button>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="send-button"
              style={{ padding: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ChatBot;