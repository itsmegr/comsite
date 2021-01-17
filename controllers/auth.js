const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { validationResult } = require('express-validator/check')

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in',
    port: 465,
    secure: true, //ssl
    auth: {
        user: 'testnodeapp@zohomail.in',
        pass: 'Govind@2000'
    }
});


exports.getLogin = (req, res, next) => {
    // console.log(req.session);
    let message = req.flash('message');
    if (message.length > 0) {
        message = message[0];
    }
    else message = null;
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: req.session.loggedIn,
        message: message,
        isError: req.flash('isError')[0],
        oldInput :{
            email:'',
            password:''
        }
    });
}


exports.getSignup = (req, res, next) => {
    let message = req.flash('message');
    if (message.length > 0) {
        message = message[0];
    }
    else message = null;
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false,
        message: message,
        oldInput: {
            email: '',
            password: ''
        },
        validationErrors: []
    });
};


exports.getForgotPassword = (req, res, next) => {
    let message = req.flash('message');
    if (message.length > 0) {
        message = message[0];
    }
    else message = null;
    res.render('auth/forgot-password', {
        path: '/forgot-password',
        pageTitle: 'Forgot Password',
        isAuthenticated: false,
        message: message,
        isError: req.flash('isError')[0]
    });
};




exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // console.log(errors.array());
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            isAuthenticated: false,
            message: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
                confirmPassword: req.body.confirmPassword
            },
            validationErrors: errors.array()
        });
    }

    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                req.flash('message', ' User already exists, try with other email ');
                req.flash('isError', true);
                return res.redirect('/signup');
            }
            return bcrypt.hash(password, 12)
                .then(hashedPass => {
                    const newUser = new User({
                        email: email,
                        password: hashedPass,
                        cart: { items: [] }
                    })
                    return newUser.save();
                })
                .then(result => {
                    res.redirect('/login');
                    // console.log(email);
                    return transporter.sendMail({
                        to: email,
                        from: 'testnodeapp@zohomail.in',
                        subject: 'SignUp Succeeded',
                        html: '<h1>Your account has been created successfull</h1>'
                    })
                }).catch(e => {
                    console.log(e);
                });
        })
        .catch(e => {
            console.log(e);
            const error = new Error(e);
            error.httpStatusCode = 500;
           return next(e);
        });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;



    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                // console.log('user Not found');
                return res.status(422).render('auth/login', {
                    pageTitle: 'Login',
                    path: '/login',
                    isAuthenticated: req.session.loggedIn,
                    message: 'Email or Password Invalid',
                    isError: true,
                    oldInput :{
                        email:email,
                        password:password
                    }
                });
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        // console.log('login successful and session created');
                        req.session.loggedIn = true;
                        req.session.user = user;
                        return req.session.save(() => {
                            res.redirect('/');
                        })
                    }
                    // req.flash('message', 'Email & Password do not match!');
                    // req.flash('isError', true);
                    // res.redirect('/login');
                    return res.status(422).render('auth/login', {
                        pageTitle: 'Login',
                        path: '/login',
                        isAuthenticated: req.session.loggedIn,
                        message: 'Email or Password Invalid',
                        isError: true,
                        oldInput :{
                            email:email,
                            password:password
                        }
                    });
                })
                .catch(e => { console.log(e) })
        })
        .catch(e => {
            console.log(e);
            const error = new Error(e);
            error.httpStatusCode = 500;
           return next(e);
        });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/login');
    })
}


exports.postForgotPassword = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        const email = req.body.email;
        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    req.flash('message', 'No such User Found');
                    req.flash('isError', true);
                    return res.redirect('/forgot-password');
                }
                user.resetPassToken = token;
                user.tokenExpiration = Date.now() + 3600000;
                user.save()
                    .then(result => {
                        req.flash('message', 'Reset Link has been sent to your mail');
                        req.flash('isError', false);
                        res.redirect('/forgot-password')
                        return transporter.sendMail({
                            to: req.body.email,
                            from: 'testnodeapp@zohomail.in',
                            subject: 'Password reset',
                            html: `
                              <p>You requested a password reset</p>
                              <p>Click this <a href="http://localhost:8080/reset/${token}">link</a> to set a new password.</p>
                            `
                        });
                    }).then(result => {
                        console.log('mail sent', result);
                    })
                    .catch(e => { console.log(e); });
            })
            .catch(e => {
                console.log(e);
                const error = new Error(e);
                error.httpStatusCode = 500;
               return next(e);
            });
    });

}



exports.getResetPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetPassToken: token, tokenExpiration: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                res.redirect('/login');
            }
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            res.render('auth/new-password', {
                path: '/reset-password',
                pageTitle: 'Reset Password',
                message: message,
                isError: req.flash('isError')[0],
                userId: user._id.toString(),
                passwordToken: token
            });
        })
        .catch(e => {
            console.log(e);
            const error = new Error(e);
            error.httpStatusCode = 500;
           return next(e);
        });
};


exports.postResetPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne({
        resetPassToken: passwordToken,
        tokenExpiration: { $gt: Date.now() },
        _id: userId
    })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetPassToken = undefined;
            resetUser.tokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            req.flash('message', 'Password reset Successfully');
            req.flash('isError', false);
            res.redirect('/login');
        })
        .catch(e => {
            console.log(e);
            const error = new Error(e);
            error.httpStatusCode = 500;
           return next(e);
        });
}
