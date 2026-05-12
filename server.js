const express = require('express');
const path = require('path');
const { createHash } = require('crypto');
const fs = require('fs');
const { askGemini } = require('./server_assets/ai-req.js');

require('dotenv').config({ path: 'serverAssets/.env' });

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Optional: default route (serves index.html automatically)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Hash
function sha256(input) {
  return createHash('sha256').update(input).digest('hex');
}

// Helper to read/write users
function readUsers(callback) {
  fs.readFile('server_assets/users.json', 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') return callback(err);
    callback(null, data ? JSON.parse(data) : []);
  });
}

function writeUsers(users, callback) {
  fs.writeFile(
    'server_assets/users.json',
    JSON.stringify(users, null, 2),
    callback,
  );
}

// Create account - this belongs to Cory
app.post('/createAccount', (req, res) => {
  var { name, email, password, catType } = req.body;

  password = sha256(password.toString());

  const newUser = {
    name,
    email,
    password,
    tasksCompleted: 0, // new
    catType: catType || 'none', // new
  };

  const full = { email, newUser };

  readUsers((err, users) => {
    if (err) return res.status(500).json({ error: 'Server error' });

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    users.push(full);

    // Save updated users list to json - this is Cory's
    writeUsers(users, (err) => {
      if (err) return res.status(500).json({ error: 'Failed to save user' });
      return res.status(200).json({ success: true });
    });
  });
});

// Login
app.post('/logIn', (req, res) => {
  var { email, password } = req.body;
  password = sha256(password);

  readUsers((err, users) => {
    if (err) return res.status(500).json({ error: 'Server error' });

    const user = users.find((user) => user.email === email.toLowerCase());

    if (!user) {
      return res
        .status(400)
        .json({ error: 'Account does not exist, please create an account' });
    }

    if (user.newUser.password !== password) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    return res.status(200).json({ success: true, name: user.newUser.name });
  });
});

// Update tasksCompleted and/or catType
app.patch('/updateUser', (req, res) => {
  const { email, tasksCompleted, catType } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  readUsers((err, users) => {
    if (err) return res.status(500).json({ error: 'Server error' });

    const userIndex = users.findIndex(
      (user) => user.email === email.toLowerCase(),
    );

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Only update fields that were actually sent
    if (tasksCompleted !== undefined) {
      users[userIndex].newUser.tasksCompleted = tasksCompleted;
    }
    if (catType !== undefined) {
      users[userIndex].newUser.catType = catType;
    }

    writeUsers(users, (err) => {
      if (err) return res.status(500).json({ error: 'Failed to update user' });
      return res.status(200).json({
        success: true,
        tasksCompleted: users[userIndex].newUser.tasksCompleted,
        catType: users[userIndex].newUser.catType,
      });
    });
  });
});

// Cory's CodeAI response
app.post('/ai', async (req, res) => {
  const { question } = req.body;

  try {
    const response = await askGemini(question);
    return res.json({ answer: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI request failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
