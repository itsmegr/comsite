const User = require('../models/user');
const bcrypt = require('bcryptjs');


exports.getLogin = (req,res,next)=>{
    // console.log(req.session);
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated:req.session.loggedIn
      });
}


exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false
    });
};


exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({email:email})
    .then(userDoc=>{
        if(userDoc){
            return res.redirect('/signup');
        }
        return bcrypt.hash(password,12)
        .then(hashedPass=>{
            const newUser = new User({
                email:email,
                password:hashedPass,
                cart:{items:[]}
            })
            return newUser.save();
        })
        .then(result=>{
            res.redirect('/login');
        });
    })
    .catch(e=>{
        console.log(e);
    })



};

exports.postLogin = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email:email})
    .then(user=>{
        if(!user){
            console.log('user Not found');
            return res.redirect('/login');
        }
        bcrypt.compare(password, user.password)
        .then(doMatch=>{
            if(doMatch){
                console.log('login successful and session created');
                req.session.loggedIn = true;
                req.session.user  = user;
                return req.session.save(()=>{
                    res.redirect('/');
                })
            }
            console.log('incorrect password');
            res.redirect('/login');
        })
        .catch(e=>{console.log(e)})
    })
    .catch(e=>{console.log(e)})
}

exports.postLogout = (req,res,next)=>{
    req.session.destroy(err=>{
        res.redirect('/login');
    })
}

