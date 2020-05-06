const express = require('express');
const mysql = require('mysql');
const apiRouter = require('./routes/index.js');


//Create Connection
db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'canadian_wealth_test'
});

//Connect

db.connect((error) => {
    if (error) {
        throw error;
    }
    console.log('Mysql Connected....');
})

const app = express();


app.use('/test', apiRouter);

port = 8000;
app.listen(port, function() {
    console.log("server started on port :" + port);
});

module.exports = app;