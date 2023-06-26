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
   // const saltRounds = 10;
    //const bs = new BcryptSalt();

    //const hashedPassword = bcrypt.hashSync(req.body.password, bs.saltRounds);
    const querySearch = 'SELECT * FROM `users` WHERE username=? && active=1';
    const querySql = 'SELECT * FROM `users` WHERE username=? && active=1';

    koneksi.query(querySearch, req.body.username, async (err, rows, field) => {
    const email = req.body.email;
        if (rows.length == 0) {
            return res.status(500).json({ success: false, message: 'nim tidak terdaftar', error: err });
        }

    // jalankan query
        koneksi.query(querySql, req.body.username, async (err, rows, field) => {
        const valid = await bcrypt.compare(req.body.password, rows[0].password)
        if (valid) {
            // jika request login berhasil
            res.status(201).json({success: true, message: 'Berhasil login', data: {id:rows[0].id, username: rows[0].username, email: rows[0].email } });

            // jika request login gagal
        } else { return res.status(500).json({ success: false, message: 'Password tidak sesuai', error:err }); }


    })});
}


const profil = async (req, res) => {
    const data ={...req.body}
    const querySearch = 'SELECT * FROM `users` WHERE id=?';
    const querySql = 'UPDATE `users` SET ? WHERE id=?';

    koneksi.query(querySearch, req.body.id, async (err, rows1, field) => {
        if (rows1.length == 0) {
            return res.status(500).json({ success: false, message: 'data tidak ditemukan', error: err });
        }

        // jalankan query
        koneksi.query(querySql, [data, req.body.id], (err, rows, field) => {
            if (!err) {
                // jika request login berhasil
                res.status(201).json({ success: true, message: 'Berhasil update data', data:{ id:rows1[0].id, email: req.body.email, username: req.body.username }});

                // jika request login gagal
            } else { return res.status(500).json({ success: false, message: 'Gagal update data', error: err }); }


        })
    });
}


const userSelf = async (req, res) => {
    const querySearch = 'SELECT * FROM `users` WHERE id=?';

    koneksi.query(querySearch, req.params.id, async (err, rows, field) => {
        if (rows.length == 0) {
            return res.status(500).json({ success: false, message: 'data tidak ditemukan', error: err });
        }
        res.status(200).json({ success: true, message: 'Berhasil menampilkan data', data:{email:rows[0].email, nim:rows[0].username} });
    });
}

const resetPassword = async (req, res) => {
    console.log(req)

    const saltRounds = 10;
    const bs = new BcryptSalt();
    const hashedPassword = bcrypt.hashSync(req.body.password_news, bs.saltRounds);

    const querySearch = 'SELECT * FROM users WHERE id=?';
    const queryUpdate = 'UPDATE users SET ? WHERE id = ?';


    koneksi.query(querySearch, req.body.id, async (err, rows1, field) => {
        if (rows1.length == 0) {
            return res.status(500).json({ message: 'Data tidak ditemukan', error: err });
        }
        const valid = await bcrypt.compare(req.body.password, rows1[0].password)

        if (valid) {

            koneksi.query(queryUpdate, [{ id: req.body.id, password: hashedPassword}, req.body.id], (err, rows, field) => {

                if (err) {
                    return res.status(500).json({ success: false, message: 'Gagal reset password!', error: err });
                }


                return res.status(201).json({ success: true, message: 'Berhasil reset password!', data: rows1 });
            });
        } else {
            return res.status(500).json({ success: false, message: 'gagal reset password, karena password lama salah!', error: err });
        }

    })
}


module.exports = { register, login, profil, resetPassword, userSelf}



