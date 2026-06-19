const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '172.31.46.59',
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
