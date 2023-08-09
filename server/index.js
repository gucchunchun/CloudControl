const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const app = express();
app.use(bodyParser.json());

const usersDataFile = path.join(__dirname, 'data', 'users.json');
const addFilesDataFile = path.join(__dirname, 'data', 'files.json');
const add_user = require('./add_user');
const change_userData = require('./change_userData');

// Handle GET requests to /api route
app.get("/api", (req, res) => {
    res.json({ message: 'Hello from server!' });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// Have Node serve the files for our built React app
app.use(express.static(path.join(__dirname, '../download-status2/build')));

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..C/download-status2/build', 'index.html'));
});

//Login system
app.post('/api/login', (req, res) => {
    const { id, pwd } = req.body;

    const jsonData = JSON.parse(fs.readFileSync(usersDataFile));
    const userIndex = jsonData.user.findIndex(user => user.id === id);
    if (userIndex === -1) {
        res.status(401).json({ message: 'Invalid ID' });
    }else {
        if(jsonData.user[userIndex].pwd === pwd) {
            res.json({ message: 'Login successful', token: userIndex, user: jsonData.user[userIndex]});
        }else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    }
});

// Signup system
app.post('/api/signup', (req, res) => {
    const { id, pwd } = req.body;
  
    const jsonData = JSON.parse(fs.readFileSync(usersDataFile));
    const userIndex = jsonData.user.findIndex(user => user.id === id);
  
    if (userIndex === -1) {
        add_user(id, pwd, jsonData)
          .then((x) => {
            res.json({ message: x }); // Respond with JSON success message
          })
          .catch((err) => {
            res.status(401).json({ message: err }); // Respond with JSON error message
          });
    } else {
        res.status(401).json({ message: 'This ID is already used' }); // Respond with JSON error message
    }
});

// get Files data
app.get('/api/files', (req, res) => {
    const jsonData = JSON.parse(fs.readFileSync(usersDataFile));
    res.json({ files: jsonData.files });
});