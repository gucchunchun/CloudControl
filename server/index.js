const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const app = express();

const usersDataFile = "./data/users.json";
const addFilesDataFile = "./data/files.json";

// Handle GET requests to /api route
app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../download-status2/build')));

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../download-status2/build', 'index.html'));
});

//Login system
app.post('/api/login', (req, res) => {
    const { id, pwd } = req.body;
  
    // Simulated user data
    const users = JSON.parse(fs.readFileSync(usersDataFile));
    const user = users.user.find((u) => u.id === id && u.pwd === pwd);
  
    if (user) {
      res.json({ message: 'Login successful', token: 'your-auth-token', user});
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
});