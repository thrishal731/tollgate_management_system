const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const db = require('./db'); // Ensure this points to your db.js file
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from Authorization header

  if (!token) return res.status(403).json({ message: 'Access denied. No token provided.' });

  // Verify the token using the secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });
    req.user = user; // Attach the user to the request object
    next(); // Pass control to the next middleware/route handler
  });
};

// User Registration Route (hashing the password)
app.post('/register-user', (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Username, password, and email are required.' });
  }

  // Hash the password before saving it
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: 'Error hashing the password.' });

    // Store the user with hashed password in the database
    const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    db.query(query, [username, hashedPassword, email], (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error while registering user.' });
      res.status(201).json({ message: 'User registered successfully.' });
    });
  });
});

// User Login Route (comparing the hashed password)
app.post('/login-user', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error while fetching user.' });
    if (results.length === 0) return res.status(404).json({ message: 'User not found.' });

    const user = results[0];

    // Compare the input password with the hashed password stored in the database
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: 'Error comparing passwords.' });
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

      // Generate JWT token after successful login
      const token = jwt.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    });
  });
});

// Route to fetch emergency services for a given tollgate name (protected)
app.get('/emergency-services/:tollgateName', authenticateToken, (req, res) => {
  const { tollgateName } = req.params;

  const query = `
    SELECT es.service_type, es.service_address
    FROM emergency_services es
    JOIN tollgate t ON es.tollgate_id = t.tollgate_id
    WHERE t.tollgate_name = ?
  `;

  db.query(query, [tollgateName], (err, results) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ message: 'Database error while fetching emergency services.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No emergency services found for this tollgate.' });
    }

    res.json(results);
  });
});

// Route to fetch fare information (protected)
app.get('/fare', authenticateToken, (req, res) => {
  db.query('SELECT * FROM fare', (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error while fetching fare information.' });
    res.json(results);
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
