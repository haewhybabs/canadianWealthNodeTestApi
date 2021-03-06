const express = require('express');
const router = require('express-promise-router')();
const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JwT_SECRET } = require('../configuration.js');
const passport = require('passport');
const passportConf = require('../passport');

var nodemailer = require('nodemailer');

signToken = userId => {
    return JWT.sign({
        iss: 'canadianwealth',
        sub: userId,
        iat: new Date().getTime(), //current time
        exp: new Date().setDate(new Date().getDate() + 1) //Current time + 1 day ahead
    }, JwT_SECRET);
}

function makeRandom(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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

// router.post('/login', passport.authenticate('local', { session: false }), function(req, res, next) {
//     if (!req.user) {
//         console.log('No')
//     }
//     const user = req.user;
//     const token = signToken(user[0].id)

//     res.status(200).json({
//         status: true,
//         token,
//         data: user[0],
//     });
// });

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            return res.status(200).json({
                status: false,
            });
        } else {
            const token = signToken(user[0].id)
            return res.status(200).json({
                status: true,
                token,
                data: user[0],
            });
        }

    })(req, res, next);
});

router.post('/reset-password', (req, res, next) => {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'haewhydev@gmail.com',
            pass: 'babalola774'
        }
    });

    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const currentDateTime = date + ' ' + time;
    const email = req.body.email;


    let sql = "Select * from users WHERE email=" + db.escape(req.body.email);
    db.query(sql, (err, result) => {
        if (err) { throw err }
        if (result.length > 0) {
            let newPassword = makeRandom(7);
            bcrypt.genSalt(10, function(err, salt) {

                bcrypt.hash(newPassword, salt, function(err, hash) {
                    //Hash password
                    let newHashPassword = hash;


                    let sql = "UPDATE users SET password=?,updated_at=? WHERE email=?";
                    db.query(sql, [newHashPassword, currentDateTime, email], (err, result) => {

                        if (err) { throw err }

                        var mailOptions = {
                            from: 'haewhydev@gmail.com',
                            to: email,
                            subject: 'Password Reset',
                            text: 'Hello! Your new password is : ' + newPassword
                        };

                        transporter.sendMail(mailOptions, function(error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent ' + info.response);

                                res.status(200).json({
                                    status: true,
                                });
                            }
                        });
                    })
                });
            });
        } else {
            res.status(200).json({
                status: false,
            });
        }

    })
});




module.exports = router;