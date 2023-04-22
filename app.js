'use strict'

//default packages
const express = require("express")
const path = require('path');
const bodyParser = require('body-parser');

// third-party packages
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer  = require('multer')

//environment variables
const MONGODB_LOG =  process.env.MONGODB_LOG
const MONGODB_URI = process.env.MONGODB_URI
const SECRET = process.env.SECRET
const PORT = process.env.PORT || 3000

//models and middlewares
const errorController = require('./controllers/error');
const accountController = require('./controllers/account');
const { fileFilter, fileStorage } = require('./middleware/multer')
const isAuth = require('./middleware/is-auth');
const User = require('./models/user');

// defined routes
const userRoutes = require('./routes/user');
const accountRoutes = require('./routes/account');
const authRoutes = require('./routes/user');

const app = express()


const store = new MongoDBStore({
    uri: MONGODB_LOG,
    collection: 'sessions'
  });


const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
  session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
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

app.post('/create-order', isAuth, accountController.postOrder);

app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/user', userRoutes);
app.use('/account', accountRoutes);
app.use('/auth', authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
});


mongoose.connect(MONGODB_URI)
  .then(result => {
    app.listen(PORT, () => console.log("Listening on port", PORT))
  }).catch(err => {
    console.log(err);
  });




