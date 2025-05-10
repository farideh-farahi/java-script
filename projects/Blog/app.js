var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var blogRouter = require("./routes/blog")
var likeBlogRouter = require("./routes/likeBlog")

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v0/auth', authRouter);
app.use('/api/v0/blogs', blogRouter);
app.use('/api/v0/like', likeBlogRouter);


module.exports = app;
