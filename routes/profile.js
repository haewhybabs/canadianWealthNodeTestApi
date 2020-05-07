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
    user = req.user[0];
    let sql = "UPDATE users SET image=? WHERE id= ?";
    db.query(sql, [imageName, user.id], (err, result) => {

        if (err) { throw err }
        res.status(200).json({
            status: true,
            message: 'file uploaded'
        });
    })


})

router.post('/update', passport.authenticate('jwt', { session: false }), function(req, res, next) {

})

module.exports = router;