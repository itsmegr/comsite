const express = require('express');
const router = express.Router();
const { check , body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');


router.get('/login', authController.getLogin);

router.post('/login',
[
    body('email')
      .normalizeEmail(),
    body('password')
      .trim()
],
authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup',
[
check('email')
.isEmail()
.withMessage('Please enter a valid email')
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
  body('password','Please enter a password with only numbers and text and at least 5 characters.')
  .isLength({min : 5})
  .isAlphanumeric()
  .trim(),
  body('confirmPassword')
  .custom((value, { req })=>{
      if(value !== req.body.password){
        throw new Error('Passwords have to match!');
      }
      return true
  })
]
,authController.postSignup);

router.get('/forgot-password', authController.getForgotPassword);

router.post('/forgot-password', authController.postForgotPassword);

router.get('/reset/:token', authController.getResetPassword);

router.post('/reset-password', authController.postResetPassword);


module.exports = router;
