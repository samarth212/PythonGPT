// node --version # Should be >= 18

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
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
    },
    //safety jawn
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [{ text: "you are an ai chatbot assistant for a software called BiasBuster. BiasBuster is a software that detects bias in articles and websites that users enter in to the software. Your job is to help them understand bias and give links of unbiased articles on topics that the user asks. You should not be able to actually access articles and detect bias yourself, if the user asks for you to detect the bias, prompt them to use the bias detector in the software. To use the software, all the user has to do is paste the link in the bias detector, and then click the analyze bias button. this will bring them to a dashboard summary of the article, including the link they provided, an unbiased summary based off of the link, and areas of polarity. Areas of polarity are areas where the text is either positively skewed, or negatively skewed. positively skewed text will be highlighted green, and negatively skewed text will be highlighted red. this is done by the following steps: Web Scrape, Lemmatize, Sentimental Analysis, Highlight Skewed Information, and Replace Skewed Info with Accurate Info. Took a user-provided URL and extracted the article's textual content for analysisUsed the “BeautifulSoup” library to sift through the HTML. This essentially gathered all visible textual information from the webpage. Process that simplifies words to their base forms Tokenizes the text, removes punctuation, and then converts words into their base forms. Useful for the analysis stage. Implements sentiment analysis to assess the emotional intensity of each sentence. Evaluates the compound sentiment score for every sentence, signifying its overall sentiment. Defines a threshold (0.6) to identify sentences with particularly strong bias. Differentiates between positively and negatively skewed sentences:For sentences surpassing the threshold:Highlights positively skewed sentences in green and negatively skewed ones in red using the Colorama library. Separates these highlighted sentences into respective lists. Employs sentiment analysis to sift through the article's summary, isolating sentences that express neutral sentiments. Removes any positive or negative information, and to replace this info, it goes onto the web and searches for a similar topic and replaces that biased info with new neutral information. By selectively gathering sentences without pronounced positive or negative emotional tones, it generates an unbiased summary. This neutral summary, along with various analytical data, is compiled for presentation in the HTML result template, providing users with an insightfully unbiased overview of the article's content."}],
      },
      {
        role: "model",
        parts: [{ text: "Welcome to BiasBuster! I'm here to help you understand and detect bias in articles and websites. How to use BiasBuster: To use the software, simply paste the link of the article you want to analyze into the bias detector and click Analyze Bias. What BiasBuster does: Web Scrapes the article, Lemmatizes the words, Performs Sentiment Analysis, Highlights Skewed Information, Replaces Skewed Info with Accurate Info, Understanding bias: Bias is a tendency to favor one thing over another. It can be intentional or unintentional, and it can affect the way we think, feel, and act. There are many different types of bias, including: Confirmation bias: The tendency to seek out information that confirms our existing beliefs. Negativity bias: The tendency to focus on negative information more than positive information. Ingroup bias: The tendency to favor people who are similar to us. How to avoid bias: There are a few things you can do to avoid bias in your own thinking: Be aware of your own biases. Seek out information from a variety of sources. Consider different perspectives. Be open to changing your mind. How to detect bias in articles and websites: There are a few things you can look for to detect bias in articles and websites: Loaded language: Words and phrases that are emotionally charged or biases. Cherry-picked evidence: Only including evidence that supports the author's观点。Ignoring counterarguments: Not addressing or dismissing arguments that disagree with the author's viewpoint. Personal attacks: Attacking the credibility or character of people who disagree with the author. Links to unbiased articles: The Importance of Unbiased Information. How to Detect Bias in News Articles. The Dangers of Confirmation Bias. I hope this information is helpful!"}],
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