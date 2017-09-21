const FacebookStrategy = require('passport-facebook').Strategy;
const shortid = require('shortid')

module.exports = function(passport, userDB) {
    passport.use('facebook', new FacebookStrategy({
            clientID: '146375905970102',
            clientSecret: '38374e8c26fbc5a14cb3b00f43c2694e',
            callbackURL: "http://localhost:3002/auth/facebook/callback",
            profileFields: ['id', 'email', 'name']
        },
        function (accessToken, refreshToken, profile, done) {
        console.log(profile)
            let user = profile._json;
            let checkUser = userDB.find(item => item.username == user.email)
            if(checkUser) {
                return done(null, checkUser.username);
            }else{
                let obj = {};
                obj.id = shortid.generate();
                obj.username = user.email;
                obj.password =''
                userDB.push(obj)
                return done(null, user.email);
            }
        }
    ));
}