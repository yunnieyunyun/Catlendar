const express = require('express');
const path = require('path');
const { createHash } = require('crypto');
const fs = require('fs');

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

//create account
app.post('/createAccount', (req, res) => {
  var { name, email, password } = req.body;

  password = sha256(password.toString());

  const newUser = {
    name,
    email,
    password,
  };

  const full = {
    email,
    newUser,
  };

  fs.readFile('server_assets/users.json', 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ error: 'Server error' });
    } else {
      let users = [];
      if (data) {
        users = JSON.parse(data);
      }

      //check if email already exists
      const existingUser = users.find((user) => user.email === email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      } else {
        users.push(full);

        //save updated users list to json
        fs.writeFile(
          'server_assets/users.json',
          JSON.stringify(users, null, 2),
          (err) => {
            if (err) {
              return res.status(500).json({ error: 'Failed to save user' });
            } else {
              return res.status(200).json({ success: true });
            }
          },
        );
      }
    }
  });
});

// Login
app.post('/logIn', (req, res) => {
  var { email, password } = req.body;
  password = sha256(password);

  fs.readFile('server_assets/users.json', 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ error: 'Server error' });
    }

    let users = [];
    if (data) {
      users = JSON.parse(data);
    }

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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
