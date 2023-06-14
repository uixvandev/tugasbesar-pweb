const express = require('express');
const bodyParser = require('body-parser');
const koneksi = require('../config/database');
const app = express();
const bcrypt = require('bcrypt');
const BcryptSalt = require('bcrypt-salt');
const { raw } = require('body-parser');
const nodemailer = require('nodemailer')
const random = require("simple-random-number-generator");
const multer = require('multer');
const path = require('path');
const url = require('url');



// set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// register user 
const register = async (req, res) => {
    // buat variabel penampung data dan query sql
    const saltRounds = 10;
    const bs = new BcryptSalt();

    const hashedPassword = bcrypt.hashSync(req.body.password, bs.saltRounds);

    const querySql = 'INSERT INTO users SET ?';

    // jalankan query
    koneksi.query(querySql, { username: req.body.username, email: req.body.email, password: hashedPassword, active:1 }, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ success: false, message: 'Gagal daftar akun!', error:err.sqlMessage });
        }

        // jika request berhasil
        res.status(201).json({ success: true, message: 'Berhasil daftar akun', data: { id: rows.insertId, username: req.body.username, email: req.body.email } });
    });
}


//login user
const login = async (req, res) => {
    // buat variabel penampung data dan query sql
    const saltRounds = 10;
    const bs = new BcryptSalt();

    const hashedPassword = bcrypt.hashSync(req.body.password, bs.saltRounds);
    const querySearch = 'SELECT * FROM `users` WHERE username="' + req.body.username + '" && active=1';
    const querySql = 'SELECT * FROM `users` WHERE username="' + req.body.username + '" && active=1';

    koneksi.query(querySearch, req.body.email, async (err, rows, field) => {
    const email = req.body.email;
        if (rows.length == 0) {
            return res.status(500).json({ success: false, message: 'nim tidak terdaftar', error: err });
        }

    // jalankan query
    koneksi.query(querySql, async (err, rows, field) => {
        const valid = await bcrypt.compare(req.body.password, rows[0].password)
        if (valid) {
            // jika request login berhasil
            res.status(201).json({success: true, message: 'Berhasil login', data: {id:rows[0].id, username: rows[0].username, email: rows[0].email } });

            // jika request login gagal
        } else { return res.status(500).json({ success: false, message: 'Password tidak sesuai', error:err }); }


    })});
}


// read data user


module.exports = { register, login}



