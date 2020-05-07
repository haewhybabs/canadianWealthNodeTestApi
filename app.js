const express = require('express');
const mysql = require('mysql');
const userRouter = require('./routes/users.js');
const bodyParser = require('body-parser');
const morgan = require('morgan');
var expressValidator = require("express-validator");
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

port = 8000;
app.listen(port, function() {
    console.log("server started on port :" + port);
});

module.exports = app;