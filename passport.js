const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const { ExtractJWT, ExtractJwt } = require('passport-jwt');
const localStrategy = require('passport-local').Strategy;
const { JwT_SECRET } = require('./configuration.js');
const bcrypt = require('bcryptjs');

//JSON WEB TOKEN STRATEGY
passport.use(new jwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JwT_SECRET
}, async(payload, done) => {
    try {
        //Find the user specified in token
        let sql = "Select * from users WHERE id=" + db.escape(payload.sub);
        db.query(sql, (err, result) => {
            if (err) { throw err }
            //if user exist 
            if (result.length > 0) {
                done(null, result);
            }
            //if user does not exist
            else {
                return done(null, false)
            }
        })

    } catch (error) {
        done(error, false)
    }
}));

//LOCAL STRATEGY

passport.use(new localStrategy({
    usernameField: 'email'
}, async(email, password, done) => {

    //Find the user given the mail
    let sql = "Select * from users WHERE email=" + db.escape(email);
    db.query(sql, (err, result) => {
        if (err) { throw err }
        //if user exist 
        if (result.length > 0) {
            bcrypt.compare(password, result[0].password, function(err, isMatch) {
                if (err) { throw err }

                if (isMatch) {
                    return done(null, result);
                } else {

                    return done(null, false);
                }
            });
        }
        //if user does not exist
        else {
            return done(null, false)
        }
    })
}))