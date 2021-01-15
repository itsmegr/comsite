const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');


router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup', authController.postSignup);

router.get('/forgot-password', authController.getForgotPassword);

router.post('/forgot-password', authController.postForgotPassword);

router.get('/reset/:token', authController.getResetPassword);

router.post('/reset-password', authController.postResetPassword);


module.exports = router;
