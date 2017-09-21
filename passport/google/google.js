const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const shortid = require('shortid')

module.exports = function(passport, userDB) {
    passport.use(new GoogleStrategy({
            clientID: '64980042356-kn2mqkp84a405aim3ufs8rvd0vragm1q.apps.googleusercontent.com',
            clientSecret: '0GEJOVWD2KGN6ty1yCzVe2fa',
            callbackURL: "http://localhost:3002/auth/google/callback"
        },
        function (accessToken, refreshToken, profile, done) {
            let email = profile.emails[0].value;
            let checkUser = userDB.find(item => item.username == email)
            if(checkUser) {
                return done(null, checkUser.username);
            }else{
                let obj = {};
                obj.id = shortid.generate();
                obj.username = email;
                obj.password =''
                userDB.push(obj)
                return done(null, email);
            }
        }
    ));
}