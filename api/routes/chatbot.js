const express = require('express');
const router = express.Router();
const axios = require('axios');

// POST /chatbot - Get chatbot response using Deepseek via OpenRouter
router.post('/', async (req, res) => {
  // Log the incoming request body for debugging
  console.log('Received chatbot request body:', req.body);

  try {
    const { message } = req.body;
    if (!message) {
      console.error('No message provided in request body');
      return res.status(400).json({ error: 'Message is required.' });
    }
    console.log('User message:', message);

    // Prepare payload for Deepseek model via OpenRouter
    const payload = {
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [
        // You can optionally include a system message for context:
        {
          role: "system",
          content: "You are an expert sustainability consultant for the SDG Finance App. Answer user questions about the eco-friendliness of products clearly and concisely."
        },
        { role: "user", content: message }
      ]
    };

    // Prepare headers using your OpenRouter API key and optional site details
    const headers = {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.HTTP_REFERER || "http://your-site-url.com", // Optional
      "X-Title": process.env.X_TITLE || "Your Site Name", // Optional
    };

    // Make the POST request to the OpenRouter API endpoint
    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", payload, { headers });
    console.log('OpenRouter response:', JSON.stringify(response.data, null, 2));

    // Extract the chatbot's reply from the response
    const reply = response.data.choices[0].message.content.trim();
    console.log('Chatbot reply:', reply);

    // Send the reply back to the client
    res.json({ reply });
  } catch (error) {
    // Log detailed error information for debugging
    console.error('Error in chatbot endpoint:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      console.error('Data:', error.response.data);
    }
    res.status(500).json({ error: 'Failed to generate response.' });
  }
});

module.exports = router;
