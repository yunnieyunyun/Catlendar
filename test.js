const { askGemini } = require('./server_assets/ai-req.js');
const readline = require('readline');

const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

const main = async () => {
  const userPrompt = await askQuestion('Ask a question to Cat AI: ');

  // Send prompt to Gemini
  const geminiResponse = await askGemini(userPrompt);

  console.log(`Response: ${geminiResponse}`);
};

main();
