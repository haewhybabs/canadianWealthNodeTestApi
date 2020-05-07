const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
''
const upload = multer({
    storage: storage,
    limit: {
        fileSize: 1024 * 1024 * 5
    },

    fileFilter: fileFilter

});

router.get('/', passport.authenticate('jwt', { session: false }), function(req, res, next) {

    res.status(200).json({
        status: true,
        data: req.user[0]
    });

})

router.post('/upload', upload.single('profileImage'), passport.authenticate('jwt', { session: false }), function(req, res, next) {
    const imageName = req.file.filename;

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var currentDateTime = date + ' ' + time;

    user = req.user[0];
    let sql = "UPDATE users SET image=?,updated_at=? WHERE id= ?";
    db.query(sql, [imageName, currentDateTime, user.id], (err, result) => {

        if (err) { throw err }

        let sql = "Select * from users WHERE id=" + db.escape(user.id);
        db.query(sql, (err, result) => {
            if (err) { throw err }
            res.status(422).json({
                status: true,
                data: result[0],
                message: "Image Uploaded"
            });

        });

    })


})

router.post('/update', passport.authenticate('jwt', { session: false }), function(req, res, next) {
    var name = req.body.name;

    var phoneNumber = req.body.phoneNumber;

    //Form Validation
    req.checkBody("name", "Name field is required").notEmpty();
    req.checkBody("phoneNumber", "Phone Number field is required").notEmpty();

    //Check for errors
    var errors = req.validationErrors();
    if (errors) {
        res.status(422).json({
            message: "Please fill all the fields",
            status: false,
            errors: errors,

        });

    } else {

        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var currentDateTime = date + ' ' + time;
        user = req.user[0];
        let sql = "UPDATE users SET phoneNumber=?, name=?, updated_at=? WHERE id= ?";
        db.query(sql, [phoneNumber, name, currentDateTime, user.id], (err, result) => {

            if (err) { throw err }
            let sql = "Select * from users WHERE id=" + db.escape(user.id);
            db.query(sql, (err, result) => {
                if (err) { throw err }
                res.status(422).json({
                    status: true,
                    data: result[0],
                    message: "profile updated successfully"
                });

            });
        })

    }
})

module.exports = router;