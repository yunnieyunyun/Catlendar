require('dotenv').config({ path: '.env' });
const { GoogleGenAI } = require('@google/genai');

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function askGemini(prompt) {
  try {
    const result = await genAI.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    });

    return result.text;
  } catch (err) {
    console.error('Gemini error:', err);
    throw err;
  }
}

module.exports = { askGemini };
