require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('./models/user');
const session = require('express-session');
const methodOverride = require('method-override');
const multer = require('multer');

// const seedPosts = require('./seeds');
// seedPosts();

const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
const reviewsRouter = require('./routes/reviews');

const app = express();

// connect to database
mongoose.connect("mongodb://localhost/ecommerce", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("we're connected!");
});

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// setup public assets directory
app.use(express.static('public'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(session({
    secret: 'Star Wars',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport, use createStrategy instead of authenticate
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// local vars
app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.title = 'Ecommerce';
  // success flash message
  res.locals.success = req.session.success || '';
  delete req.session.success;
  // failure flash message
  res.locals.error = req.session.error || '';
  delete req.session.error;
  // continue on to next middleware chain
  next();
});

app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/posts/:id/reviews', reviewsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  console.log(err);
  req.session.error = err.message;
  res.redirect('back');
});



module.exports = app;
