'use strict'

const path = require('path');
require('dotenv').config()
require('./util/database')

// Third-party libraries
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const csrf = require('csurf');
const flash = require('connect-flash');

//User & Error middleware
const errorController = require('./controllers/error');
const User = require('./models/user');

//custom routes
const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');

// Environment variables
const MONGODB_LOG = process.env.MONGODB_LOG
const JWT_SECRET = process.env.JWT_SECRET
const PORT = process.env.PORT || 3000

const app = express();
const csrfProtection = csrf();

// Template Engine
app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use(flash());

//Session middleware
const store = new MongoDBStore({
  uri: MONGODB_LOG,
  collection: 'sessions'
});

app.use(
  session({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
  })
);


app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});


app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// custom routes
app.use(homeRoutes);
app.use(authRoutes);

// Route mismatch middleware
app.get('/500', errorController.get500);
app.use(errorController.get404);




app.listen(PORT, function() { console.log(`Listening on port  http://localhost:${PORT}`);});

