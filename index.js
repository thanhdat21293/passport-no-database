const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');
const {db,} = require('./pgp');
const flash = require("connect-flash");

const passport = require('passport');

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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(session({
    cookie: {maxAge: (3600 * 1000)},
    unser: 'destroy',
    secret: 'JackCodeHammer',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))

app.get('/getData', (req,res) => {
    let getName = req.query.name;
    // res.send('<div class="abc"><h1> ' + getName + ' </h1></div>');
});

app.post('/getData', (req,res) => {
    console.log(req.body)
    let getName = req.body.name;
    //res.send('<div class="abc"><h1> 1' + getName + ' </h1></div>');
    // setTimeout(function(){
    //     res.send('<div class="abc"><h1> 13425345345 </h1></div>');
    // }, 3000)

    setTimeout(function(){
        res.send('<div class="abc"><h1> 13425345345 </h1></div>');
    }, 2000)

    //res.json({a:11, b: 2})
});

/**
 * SET UP Passport
 */

//app.use(express.cookieParser());
// app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());



require('./passport/passport')(passport)
require('./passport/facebook/facebook')(passport)
require('./passport/google/google')(passport)
require('./passport/local/local')(passport)


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
    console.log('req.user', req.user)
    console.log('Session', req.session)
    console.log(req.user)
    res.render('index', {
        login: req.session.login,
        user: req.session.user,
    })
});

app.get('/json', (req, res) => {
    // console.log('req.user', req.user)
    // console.log('Session', req.session)
    // console.log(req.user)
    // res.render('index', {
    //     login: req.session.login,
    //     user: req.session.user,
    // })
    res.json({
        task: [
            {desc: 'Tắm biển'},
            {desc: 'thì phải'},
            {desc: 'mặc bikini,'},
            {desc: 'không mặc'},
            {desc: 'bikini thì'},
            {desc: 'không phải'},
            {desc: 'là tắm biển'},
            {desc: 'Ahihi'},
        ]
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

        res.redirect('/private');
    });

app.get('/login/facebook',
    passport.authenticate('facebook')
);

app.get('/login/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/private');
  });


app.get('/register', (req, res) => {
    res.render('register')
});

app.post('/register', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    bcrypt.hash(password, null, null, function (err, hash) {
        db.none('INSERT INTO ws_users(username, password) VALUES($1, $2)', [username, hash])
            .then(() => {
                res.render('register', {message: 'Đăng ký thành công!'})
            })
            .catch(error => {
                res.render('register', {message: error.message})
            })
    });
});

app.get('/private', (req, res) => {
    console.log(req.session)
    if (req.isAuthenticated()) {
        res.send('Đã login')
    } else {
        res.send('Chưa login')
    }
});


// passport.authenticate('local', { failureFlash: 'Invalid username or password.' });
// passport.authenticate('local', { successFlash: 'Welcome!' });


const port = 3002;
app.listen(port, () => {
    console.log('Ready for GET requests on http://localhost:' + port);
});