const express = require('express');
const path = require('path');
const { createHash } = require('crypto');
const fs = require('fs');
const { askGemini } = require('./server_assets/ai-req.js');

require('dotenv').config({ path: 'serverAssets/.env' });

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'server_assets', 'users.json');

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
  fs.readFile(USERS_FILE, 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') return callback(err);
    callback(null, data ? JSON.parse(data) : []);
  });
}

function writeUsers(users, callback) {
  fs.writeFile(
    USERS_FILE,
    JSON.stringify(users, null, 2),
    callback,
  );
}

function findUserByEmail(users, email) {
  return users.find(
    (user) =>
      user.email &&
      user.email.toLowerCase() === email.toLowerCase(),
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
    completedTasks: [],
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

    const user = findUserByEmail(users, email);

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

app.patch('/updateUser', (req, res) => {
  const { email, updates } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email is required',
    });
  }

  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({
      success: false,
      error: 'Updates object is required',
    });
  }

  readUsers((err, users) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Failed to read users',
      });
    }

    const userIndex = users.findIndex(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const user = users[userIndex];

    // Allowed fields to update
    const allowedFields = [
      'tasksCompleted',
      'completedTasks',
      'catType',
      'xp',
      'coins',
      'level',
      'streak',
      'title',
    ];

    // Create newUser object if missing
    if (!user.newUser) {
      user.newUser = {};
    }

    const changes = {};

    // Apply updates safely
    for (const key in updates) {
      if (!allowedFields.includes(key)) {
        continue;
      }

      const oldValue = user.newUser[key];
      const newValue = updates[key];

      user.newUser[key] = newValue;

      changes[key] = {
        before: oldValue,
        after: newValue,
      };
    }

    // Metadata
    user.newUser.lastUpdated = new Date().toISOString();

    // Update history
    if (!user.newUser.updateHistory) {
      user.newUser.updateHistory = [];
    }

    user.newUser.updateHistory.push({
      timestamp: new Date().toISOString(),
      changes,
    });

    writeUsers(users, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: 'Failed to save user',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        updatedFields: Object.keys(changes),
        changes,
        user: user.newUser,
      });
    });
  });
});

app.get('/completedTasks', (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email is required',
    });
  }

  readUsers((err, users) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Failed to read users',
      });
    }

    const user = findUserByEmail(users, email);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const completedTasks = user.newUser.completedTasks || [];

    return res.status(200).json({
      success: true,
      tasksCompleted: completedTasks.length,
      completedTasks,
    });
  });
});

app.post('/completedTasks', (req, res) => {
  const { email, task, taskDate } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email is required',
    });
  }

  if (!task || typeof task !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Task is required',
    });
  }

  readUsers((err, users) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Failed to read users',
      });
    }

    const user = findUserByEmail(users, email);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    if (!user.newUser) {
      user.newUser = {};
    }

    if (!Array.isArray(user.newUser.completedTasks)) {
      user.newUser.completedTasks = [];
    }

    const completedTask = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      task: task.trim(),
      taskDate: taskDate || new Date().toISOString().slice(0, 10),
      completedAt: new Date().toISOString(),
    };

    user.newUser.completedTasks.push(completedTask);
    user.newUser.tasksCompleted = user.newUser.completedTasks.length;
    user.newUser.lastUpdated = new Date().toISOString();

    writeUsers(users, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: 'Failed to save completed task',
        });
      }

      return res.status(201).json({
        success: true,
        task: completedTask,
        tasksCompleted: user.newUser.tasksCompleted,
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
