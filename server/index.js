const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const PORT = process.env.PORT || 3001;
const app = express();
app.use(bodyParser.json());
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 5 * 1024 * 1024 }, 
 });

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
app.use(express.static(path.join(__dirname, '../download-status/build')));

//Login system
app.post('/api/login', (req, res) => {
    const { id, pwd } = req.body;

    const jsonData = JSON.parse(fs.readFileSync(usersDataFile));
    const userIndex = jsonData.user.findIndex(user => user.id === id);
    if (userIndex === -1) {
        res.status(401).json({ message: 'Invalid ID' });
    }else {
        if(jsonData.user[userIndex].pwd === pwd) {
            res.json({ message: 'Login successful. Hello ' + id, token: userIndex, user: jsonData.user[userIndex]});
        }else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    }
});

// Signup system
app.post('/api/signUp', (req, res) => {
    const { id, pwd } = req.body;
  
    const jsonData = JSON.parse(fs.readFileSync(usersDataFile));
    const userIndex = jsonData.user.findIndex(user => user.id === id);
  
    if (userIndex === -1) {
        add_user(id, pwd, jsonData)
          .then((x) => {
            res.json({ message: x, token: jsonData.user.length, user: jsonData.user[userIndex] }); // Respond with JSON success message
          })
          .catch((err) => {
            console.log(err);
            res.status(401).json({ message: err }); // Respond with JSON error message
          });
    } else {
        res.status(401).json({ message: 'This ID is already used' }); // Respond with JSON error message
    }
});

// get Files data
app.get('/api/files', (req, res) => {
    const jsonData = JSON.parse(fs.readFileSync(addFilesDataFile));
    res.json({ files: jsonData.files });
});

// save updated user data
app.post('/api/save', (req, res) => {
    const { new_userData, dataIndex } = req.body;

    change_userData(new_userData, dataIndex)
    .then((x) =>{
        res.json({ message: x});
    })
    .catch((err) => {
        res.status(401).json({ message: err });
    });
});

// get user avatar data
app.get('/api/avatar/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, 'data', 'img', filename);

    // Send the image file as a response
    res.sendFile(imagePath);
});

// Handle image upload
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const { originalname, filename } = req.file;
    const userId = req.body.userId; // Get the user ID from the request body

    const newFilename = `${userId}Avatar${path.extname(originalname)}`;
    const imagePath = path.join(__dirname, 'data', 'img', newFilename);

    fs.renameSync(req.file.path, imagePath); // Rename and move the uploaded file

    res.json({ message: 'Image uploaded successfully', path:'/api/avatar/'+newFilename });
});