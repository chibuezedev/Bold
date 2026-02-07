const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');

const User = require('../models/user');
const Newsletter = require('../models/newsletter');



exports.getSignup = (req, res, next) => {

  let message = req.flash('error');
  
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};

//signup handler
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        username: username,
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword
      },
      validationErrors: errors.array()
    });
  }

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        username: username,
        email: email,
        password: hashedPassword,
      });
      return user.save();
    })
    .then(result => {
      res.redirect('/');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

//user login controller
exports.postLogin = (req, res, next) => {
  const email = typeof req.body.email === 'string' ? req.body.email : '';
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  }

  User.findOne({ email: { $eq: email } })
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/signup', {
          path: '/signup',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password.',
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/payments');
            });
          }
          return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password.',
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: []
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect('/signup');
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

//user logout
exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getPayments = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('main/payments', {
    path: '/payments',
    pageTitle: 'Make Payment',
    errorMessage: message
  });
};


exports.getPaypalItem = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('main/paypal-item', {
    path: '/paypal-item',
    pageTitle: 'Ape NFT',
    errorMessage: message
  });
};


exports.getCardItem = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('main/card-item', {
    path: '/card-item',
    pageTitle: 'Ape NFT',
    errorMessage: message
  });
};




exports.postNewsletter = async (req, res, next) => {

  const email = req.body.email;


  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('/', {
      path: '/',
      errorMessage: errors.array()[0].msg,
      email: email,
      validationErrors: errors.array()
    });
  }
     await new Newsletter({email: email})

     res.render('includes/newsletter', {
    path: '/newsletter',
   }
   )

}



exports.getAboutus = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('main/about', {
    path: '/about',
    pageTitle: 'About Solomon',
    errorMessage: message
  });
};



exports.getComing = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('main/coming', {
    path: '/coming',
    pageTitle: 'Coming Soon',
    errorMessage: message
  });
};
