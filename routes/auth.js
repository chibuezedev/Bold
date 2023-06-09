const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/main');
const User = require('../models/user');

const router = express.Router();

router.get('/signup', authController.getLogin);

router.get('/signup', authController.getSignup);


//login route
router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('password', 'Password has to be valid.')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
  authController.postLogin
);

//signup route
router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              'E-Mail exists already, please pick a different one.'
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      'password',
      'Please enter a password with only numbers and text and at least 5 characters.'
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      })
  ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/payments', authController.getPayments);

router.get('/paypal-item', authController.getPaypalItem);

router.get('/card-item', authController.getCardItem);

router.post('/newsletter', authController.postNewsletter);

router.get('/about', authController.getAboutus);

router.get('/coming', authController.getComing);


module.exports = router;
