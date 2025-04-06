import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './Chatbot.css';

function ChatBot() {
  const [userMessage, setUserMessage] = useState('');
  // Initialize chat history with a filler welcome message
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: 'Welcome to the SDG Finance ChatBot! Ask me anything about sustainable finance, eco-friendly products, or socially responsible investing. For example: "How can I invest sustainably?"' }
  ]);
  const chatHistoryRef = useRef(null);

  // Scroll chat history to the bottom when new messages are added
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    // Append user message to chat history
    const newHistory = [...chatHistory, { sender: 'user', text: userMessage }];
    setChatHistory(newHistory);

    try {
      // Send the request to the backend chatbot endpoint
      const response = await axios.post('/api/chatbot', { message: userMessage });
      const reply = response.data.reply;
      setChatHistory([...newHistory, { sender: 'bot', text: reply }]);
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
      setChatHistory([...newHistory, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    }

    setUserMessage('');
  };

  // Allow sending message via Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
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
            <p>{msg.text}</p>
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
      </div>
    </motion.div>
  );
}

export default ChatBot;
