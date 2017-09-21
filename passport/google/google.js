const {db,} = require('../../pgp');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
            clientID: '64980042356-kn2mqkp84a405aim3ufs8rvd0vragm1q.apps.googleusercontent.com',
            clientSecret: '0GEJOVWD2KGN6ty1yCzVe2fa',
            callbackURL: "http://localhost:3002/auth/google/callback"
        },
        function (accessToken, refreshToken, profile, done) {
            let email = profile.emails[0].value;
            db.oneOrNone('SELECT * FROM ws_users WHERE username = $1', email)
                .then(data => {
                    if (data) {
                        return done(null, data.username);
                    }
                    db.one('INSERT INTO ws_users(username) VALUES($1) RETURNING username', email)
                        .then(data => {
                            return done(null, data.username);
                        })
                        .catch(err => {
                            return done(null, false, {message: err.message})
                        })
                })
                .catch(error => {
                    return done(null, false, {message: error.message})
                });
        }
    ));
}