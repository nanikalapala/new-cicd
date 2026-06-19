const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'insuranceuser',
    password: 'insurance123',
    database: 'insurance_db'
});

db.connect((err) => {

    if (err) {
        console.error('MySQL Error:', err);
        return;
    }

    console.log('MySQL Connected');

});

module.exports = db;
