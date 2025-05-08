const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const morgan = require("morgan");

const AppError = require('./utils/AppError');
const coursesRouter = require('./routes/couresRouter');

dotenv.config({ path: './.env' });

const app = express();
app.use(morgan("dev"));

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.DB)
  .then(() => console.log('DB connection successful'))
  .catch((err) => {
    console.error('DB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api', coursesRouter);

// Not founded route handler
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Error handling 
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
