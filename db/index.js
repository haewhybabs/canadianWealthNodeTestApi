//Create Connection
const db = mysql.createConnection({
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