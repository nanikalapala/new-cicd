const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'insuranceuser',
    password: 'insurance123',
    database: 'insurance_db'
});

db.connect((err)=>{
    if(err){
        console.log("MySQL Error:", err);
    } else {
        console.log("MySQL Connected");
    }
});

module.exports = db;
