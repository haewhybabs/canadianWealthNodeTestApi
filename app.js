const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const morgan = require('morgan');
var expressValidator = require("express-validator");
const userRouter = require('./routes/users.js');
const profileRouter = require('./routes/profile.js');
//Create Connection
db = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7338563',
    password: 'Sp3CmRgtbA',
    database: 'sql7338563'
});

//Connect

db.connect((error) => {
    if (error) {
        throw error;
    }
    console.log('Mysql Connected....');
})

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));

//validator
app.use(
    expressValidator({
        errorFormatter: function(param, msg, value) {
            var namespace = param.split("."),
                root = namespace.shift(),
                formParam = root;

            while (namespace.length) {
                formParam += "[" + namespace.shift() + "]";
            }
            return {
                param: formParam,
                msg: msg,
                value: value
            };
        }
    })
);


app.use('/user', userRouter);
app.use('/profile', profileRouter);

port = 8000;
app.listen(port, function() {
    console.log("server started on port :" + port);
});

module.exports = app;