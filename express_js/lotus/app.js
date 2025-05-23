var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sequelize = require('./database/sequelize');

//Checking connection to database
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");
  } catch (err) {
    console.error("Database connection error:", err);
  }
})();

//Express application
var app = express();

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Importing route
var authRouter = require('./routes/auth');
var blogRouter = require('./routes/blogs');
var likeRouter = require('./routes/like');

// Routes
app.use('/api/auth', authRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/like', likeRouter);

// Catch 404 
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler 
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({ 
      success: false, 
      msg: "An error occurred", 
      error: err.message 
  });
});

module.exports = app;
