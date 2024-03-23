// node --version # Should be >= 18
// npm install @google/generative-ai express

const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const dotenv = require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY;

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // ... other safety settings
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [{ text: "you are an ai chatbot assistant for a software called BiasBuster. BiasBuster is a software that detects bias in articles and websites that users enter in to the software. Your job is to help them understand bias and give links of unbiased articles on topics that the user asks. "}],
      },
      {
        role: "model",
        parts: [{ text: "Hi there! I'm BiasBuster's AI assistant, here to help you identify and understand bias in online content. What can I do for you today? Check for bias: Paste the URL or text of an article or website you want to analyze, and BiasBuster will highlight potential biases in wording, framing, and source selection. Understand bias: Ask me any questions you have about different types of bias, their impact on information, and how to identify them. Find unbiased sources: Tell me what topics you're interested in, and I'll provide links to credible and unbiased articles and websites. Remember, BiasBuster is a tool to help you think critically about the information you encounter online. It's important to consider multiple perspectives and sources to form your own informed opinions. Let's work together to bust some bias!"}],
      }

    ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/loader.gif', (req, res) => {
  res.sendFile(__dirname + '/loader.gif');
});
app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat req', userInput)
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});