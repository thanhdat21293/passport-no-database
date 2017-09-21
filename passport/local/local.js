const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport, userDB){
    passport.use(new LocalStrategy(
        function (username, password, done) {
            let checkUser = userDB.find(item => item.username == username && item.password == password)
            if(checkUser) {
                return done(null, checkUser.username);
            }else{
                return done(null, false, {message: 'Incorrect username or password.'});
            }
        }
    ));
}