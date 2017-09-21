const {db,} = require('../../pgp');
const FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(passport) {
    passport.use('facebook', new FacebookStrategy({
            clientID: '724038607649657',
            clientSecret: 'ee909a7ea7210e8c3fa3aeb3716366e5',
            callbackURL: "http://localhost:3002/auth/facebook/callback",
            profileFields: ['id', 'emails', 'name']
        },
        function (accessToken, refreshToken, profile, done) {
        console.log(profile)
            let user = profile._json;
            db.oneOrNone('SELECT * FROM ws_users WHERE username = $1', user.email)
                .then(data => {
                    if (data) {
                        return done(null, data.username);
                    }
                    db.one('INSERT INTO ws_users(username) VALUES($1) RETURNING username', user.email)
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