const mysql = require('mysql');

// untuk konfigurasi koneksi
const koneksi = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_tb',
    multipleStatements: true
});

// koneksi database
koneksi.connect((err) => {
    if (err) throw err;
    console.log('SERVER SEDANG BERJALAN.....');
    console.log("localhost:3000");
});

module.exports = koneksi;