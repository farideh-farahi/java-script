var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const pool = require('./database/db');


pool.query('SELECT NOW()', (err, res) => {
  if (err) {
      console.error("Database connection error:", err);
  } else {
      console.log("Database connected:", res.rows[0]);
  }
});

var authRouter = require('./routes/auth');
var blogRouter = require('./routes/blogs');
var blogDetailsRouter = require('./routes/blog_details');



var app = express();

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.use('/api/auth', authRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/blogs/details', blogDetailsRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler (Updated to return JSON responses)
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({ 
      success: false, 
      msg: "An error occurred", 
      error: err.message 
  });
});

module.exports = app;
