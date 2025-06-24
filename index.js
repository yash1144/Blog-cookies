const express = require('express');
const port = 9000
const app = express();

const path = require('path');
const db = require('./config/database');
const fs = require('fs');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const User = require('./models/user');

// Import routes
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');

// Import middleware
const { setLocals } = require('./middleware/auth');

// App configuration
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Middleware
app.use(setLocals);

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Default route - always redirect to blogs
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong");
});

// Routes
app.use('/', authRoutes);
app.use('/blogs', blogRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});