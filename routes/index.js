const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    let sql = "Select * from users";
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json({
            data: result
        });
    })

})


module.exports = router;