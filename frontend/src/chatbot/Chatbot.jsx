import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './Chatbot.css';

function ChatBot() {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: 'Welcome to the SDG Finance ChatBot! Ask me anything about sustainable finance, eco-friendly products, or socially responsible investing. For example: "How can I invest sustainably?"', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // State for the selected image
  const [selectedFile, setSelectedFile] = useState(null); // State for the selected file
  const chatHistoryRef = useRef(null);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!userMessage.trim() && !selectedImage && !selectedFile) return;

    const newHistory = [...chatHistory];
    if (selectedImage) {
      newHistory.push({ sender: 'user', image: selectedImage, timestamp: new Date().toLocaleTimeString() });
    }
    if (selectedFile) {
      newHistory.push({ sender: 'user', file: selectedFile, timestamp: new Date().toLocaleTimeString() });
    }
    if (userMessage.trim()) {
      newHistory.push({ sender: 'user', text: userMessage, timestamp: new Date().toLocaleTimeString() });
    }

    setChatHistory(newHistory);
    setUserMessage('');
    setSelectedImage(null); // Clear the selected image
    setSelectedFile(null); // Clear the selected file
    setIsTyping(true);

    try {
      const formData = new FormData();
      if (selectedImage) {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        formData.append('image', blob);
      }
      if (selectedFile) {
        const response = await fetch(selectedFile);
        const blob = await response.blob();
        formData.append('file', blob);
      }
      formData.append('message', userMessage);

      const response = await axios.post('/api/chatbot', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const reply = response.data.reply;
      setChatHistory([...newHistory, { sender: 'bot', text: reply, timestamp: new Date().toLocaleTimeString() }]);
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
      setChatHistory([...newHistory, { sender: 'bot', text: 'Sorry, something went wrong.', timestamp: new Date().toLocaleTimeString() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageURL = `${URL.createObjectURL(file)}#${new Date().getTime()}`; // Ensure unique URL
      setSelectedImage(imageURL); // Set the selected image
    } catch (error) {
      console.error('Error handling image upload:', error);
    } finally {
      e.target.value = ''; // Reset the file input value to allow re-uploading the same image
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileURL = `${URL.createObjectURL(file)}#${new Date().getTime()}`; // Ensure unique URL
      setSelectedFile(fileURL); // Set the selected file
    } catch (error) {
      console.error('Error handling file upload:', error);
    } finally {
      e.target.value = ''; // Reset the file input value to allow re-uploading the same file
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null); // Clear the selected image
  };

  const handleRemoveFile = () => {
    setSelectedFile(null); // Clear the selected file
  };

  const handleResetChat = () => {
    setChatHistory([
      { sender: 'bot', text: 'Welcome to the SDG Finance ChatBot! Ask me anything about sustainable finance, eco-friendly products, or socially responsible investing. For example: "How can I invest sustainably?"', timestamp: new Date().toLocaleTimeString() }
    ]);
  };

  return (
    <div className="wrapper">
      <motion.div className='chatbot-page' 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <h1 className="chatbot-title">SDG Finance ChatBot</h1>
        <div className="chatbot-section">
          <div className="chat-history" ref={chatHistoryRef}>
            {chatHistory.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.text && <p>{msg.text}</p>}
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="User Upload"
                    style={{
                      maxWidth: '200px',
                      borderRadius: '12px',
                      marginTop: '0.5rem',
                      boxShadow: 'var(--shadow)'
                    }}
                  />
                )}
                {msg.file && (
                  <p
                    style={{
                      background: 'var(--light)',
                      padding: '0.5rem 1rem',
                      borderRadius: '12px',
                      boxShadow: 'var(--shadow)',
                      marginTop: '0.5rem',
                      color: 'var(--primary)' // Change font color for the file URL
                    }}
                  >
                    {msg.file.split('/').pop()}
                  </p>
                )}
                <span className={`timestamp ${msg.sender}`}>{msg.timestamp}</span>
              </div>
            ))}
            {isTyping && <div className="chat-message bot"><p>Typing...</p></div>}
          </div>
          {selectedImage && (
            <div className="selected-image-container" style={{ 
              position: 'absolute', // Absolute positioning
              bottom: '220px', // Place closer to the chat-input div
              left: '50%',
              transform: 'translateX(-50%)', // Center the image horizontally
              zIndex: 10, // Ensure it overlaps other elements
              display: 'inline-block' 
            }}>
              <img
                src={selectedImage}
                alt="Selected"
                style={{
                  maxWidth: '300px',
                  borderRadius: '12px',
                  marginBottom: '1rem',
                  boxShadow: 'var(--shadow)'
                }}
              />
              <button
                onClick={handleRemoveImage}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: 'var(--danger)',
                  color: 'var(--light)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '16px',
                  lineHeight: '1'
                }}
              >
                &times;
              </button>
            </div>
          )}
          {selectedFile && (
            <div className="selected-file-container" style={{ 
              position: 'absolute', 
              bottom: '220px', 
              left: '50%',
              transform: 'translateX(-50%)', 
              zIndex: 10, 
              display: 'inline-block' 
            }}>
              <p
                style={{
                  background: 'var(--light)',
                  padding: '0.5rem 1rem',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow)',
                  marginBottom: '1rem',
                  color: 'var(--primary)' // Change font color for the selected file URL
                }}
              >
                {selectedFile.split('/').pop()}
              </p>
              <button
                onClick={handleRemoveFile}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: 'var(--danger)',
                  color: 'var(--light)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '16px',
                  lineHeight: '1'
                }}
              >
                &times;
              </button>
            </div>
          )}
          <div className="chat-input-container">
            <label className="upload-button" style={{ cursor: 'pointer', padding: '0.5rem 0.75rem', fontSize: '1.5rem', marginTop: '0.5rem' }}>
              📄
              <input
                type="file"
                onChange={handleFileUpload}
                style={{ display: 'none'}}
              />
            </label>
            <label className="upload-button" style={{ cursor: 'pointer', padding: '0.5rem 0.75rem', fontSize: '1.5rem', marginTop: '0.5rem' }}>
              📷
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </label>
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything..."
              className="chat-input"
            />
            <button onClick={handleSendMessage} className="send-button">Send</button>
          </div>
          <button      
            onClick={handleResetChat} className="reset-button">Reset Chat
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ChatBot;
