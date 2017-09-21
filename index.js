const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');
const flash = require("connect-flash");

const passport = require('passport');

let userDB = [
    {
        id: 1,
        username: 'techmaster',
        password: '111'
    },
    {
        id: 2,
        username: 'docker',
        password: '123'
    },
]
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({extended: true}));

nunjucks.configure('views', {
    autoescape: false,
    express: app,
    cache: false,
    watch: true
});
app.engine('html', nunjucks.render);
app.set('view engine', 'html');

app.use(session({
    cookie: {maxAge: (3600 * 1000)},
    unser: 'destroy',
    secret: 'JackCodeHammer',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))


/**
 * SET UP Passport
 */

//app.use(express.cookieParser());
// app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());



require('./passport/passport')(passport, userDB)
require('./passport/facebook/facebook')(passport, userDB)
require('./passport/google/google')(passport, userDB)
require('./passport/local/local')(passport, userDB)


app.use((req, res, next) => {
    if (req.isAuthenticated()) {
        req.session.login = true;
        req.session.user = req.user;
    } else {
        req.session.login = false;
        req.session.user = {};
    }
    next();
});

app.get('/', (req, res) => {
    console.log(userDB)
    console.log('req.user', req.user)
    console.log('Session', req.session)
    res.render('index', {
        login: req.session.login,
        user: req.session.user,
    })
});

app.get('/login', (req, res) => {
    let message = '';
    if (req.session.flash) {
        message = req.session.flash.error.length > 0 ? req.session.flash.error[0] : '';
    }
    req.session.flash = '';
    res.render('login', {
        message: message
    })
});

app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/login',
        failureFlash: true
    }), function(req, res) {

        res.redirect('/');
    });

app.get('/login/facebook',
    passport.authenticate('facebook', { scope: ['email']})
);

app.get('/login/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });


app.get('/register', (req, res) => {
    res.render('register')
});


app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

const port = 3002;
app.listen(port, () => {
    console.log('Ready for GET requests on http://localhost:' + port);
});