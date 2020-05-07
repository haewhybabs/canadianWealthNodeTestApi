const express = require('express');
const router = require('express-promise-router')();
const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JwT_SECRET } = require('../configuration.js');
const passport = require('passport');
const passportConf = require('../passport');

signToken = userId => {
    return JWT.sign({
        iss: 'canadianwealth',
        sub: userId,
        iat: new Date().getTime(), //current time
        exp: new Date().setDate(new Date().getDate() + 1) //Current time + 1 day ahead
    }, JwT_SECRET);
}
router.post('/registration', (req, res, next) => {

    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var password_confirmation = req.body.password_confirmation;
    var phoneNumber = req.body.phoneNumber;

    //Form Validation
    req.checkBody("name", "Name field is required").notEmpty();
    req.checkBody("phoneNumber", "Phone Number field is required").notEmpty();
    req.checkBody("email", "Email field is not valid").isEmail();
    req.checkBody("password", "Password field is required").notEmpty();
    req.checkBody("password_confirmation", "Password do not match").equals(req.body.password);


    //Check for errors
    var errors = req.validationErrors();
    if (errors) {
        res.status(422).json({
            message: "Please fill all the fields",
            status: false,
            errors: errors,

        });

    } else {

        let sql = "Select * from users WHERE email=" + db.escape(req.body.email);
        db.query(sql, (err, result) => {

            if (err) { throw err }

            if (result.length > 0) {
                res.status(422).json({
                    status: false,
                    errors: [{
                        param: "email",
                        msg: "email is already existing"
                    }]

                });
            } else {

                newUser = {
                    name,
                    email,
                    password,
                    phoneNumber
                }
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, function(err, hash) {
                        //Hash password
                        newUser.password = hash;
                        let sql = "INSERT INTO users SET ?";
                        let query = db.query(sql, newUser, (err, result) => {
                            if (err) { throw err }

                            newUser.id = result.insertId;

                            const token = signToken(result.insertId)


                            res.status(200).json({
                                status: true,
                                token,
                                data: newUser,
                            });
                        })
                    });
                });


            }
        })
    }

});

router.post('/login', passport.authenticate('local', { session: false }), function(req, res, next) {
    const user = req.user;
    const token = signToken(user[0].id)

    res.status(200).json({
        status: true,
        token,
        data: user[0],
    });
});


module.exports = router;