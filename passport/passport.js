const {db,} = require('../pgp');
module.exports = function (passport) {
    //Dữ liệu ở serializeUser trả về và lưu vào session.passport
    passport.serializeUser(function (user, done) {
        console.log('serializeUser', user)
        done(null, user);
    });

    //Dữ liệu ở deserializeUser trả về và lưu vào req.user
    passport.deserializeUser(function (user, done) {
        console.log('deserializeUser', user)
        db.one('SELECT * FROM ws_users WHERE username = $1', user)
            .then(data => {
                done(null, data.username);
            })
            .catch(err => {
                done(err, user);
            })

    });
}