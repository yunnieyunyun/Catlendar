require('dotenv').config({ path: '.env' });
const { GoogleGenAI } = require('@google/genai');

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function askGemini(prompt) {
  try {
    const new_prompt = `${prompt} plus add some cool info about cats and talk like a cat, maybe say some meows or something, keep it short though, YOU ARE A CAT`;
    const result = await genAI.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          role: 'user',
          parts: [{ text: new_prompt }],
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
