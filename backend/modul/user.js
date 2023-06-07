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
        res.status(201).json({ success: true, message: 'Berhasil daftar akun', data: {  username: req.body.username, email: req.body.email } });
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
            res.status(201).json({success: true, message: 'Berhasil login', data: { username: rows[0].username, email: rows[0].email } });

            // jika request login gagal
        } else { return res.status(500).json({ success: false, message: 'Gagal login', error:err }); }


    })});
}


// read data user
const readUser = async (req, res) => {
    // buat query sql
    const querySql = 'SELECT * FROM user';
    // jalankan query
    koneksi.query(querySql, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ success: false, message: 'Ada kesalahan', error: err });
        }


        // jika request berhasil
        res.status(200).json({
            success: true, data: rows
        });
    });
}


// update data user
const updateUser = (req, res) => {
    if (req.body.password_hash != "") {
        const saltRounds = 10;
        const bs = new BcryptSalt();

        const hashedPassword = bcrypt.hashSync(req.body.password_hash, bs.saltRounds);

        req.body.password_hash = hashedPassword
        const querySearch = 'SELECT * FROM user WHERE id = ?';
        const queryUpdate = 'UPDATE user SET ? WHERE id = ?';

        koneksi.query(querySearch, req.params.id, (err, rows, field) => {
            // error handling
            if (err) {
                return res.status(500).json({ message: 'Ada kesalahan', error: err });
            }

            if (rows.length) {

                const data = { ...req.body };
                // jalankan query update
                koneksi.query(queryUpdate, [data, req.params.id], (err, rows, field) => {
                    // error handling
                    if (err) {
                        return res.status(500).json({ message: 'Ada kesalahan', error: err });
                    }

                    // jika update berhasil
                    res.status(200).json({ success: true, message: 'Berhasil update data!', data: { name: req.body.name, username: req.body.username, phone: req.body.phone, email: req.body.email } });
                });
            } else {
                return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
            }
        });
    }
    else {
        const querySearch = 'SELECT * FROM user WHERE id = ?';
        const queryUpdate = 'UPDATE user SET ? WHERE id = ?';

        // jalankan query untuk melakukan pencarian data
        koneksi.query(querySearch, req.params.id, (err, rows, field) => {
            // error handling
            if (err) {
                return res.status(500).json({ success: false ,message: 'Ada kesalahan', error: err });
            }

            // jika id yang dimasukkan sesuai dengan data yang ada di db
            if (rows.length) {

                // jalankan query update
                koneksi.query(queryUpdate, [{ name: req.body.name, username: req.body.username, phone: req.body.phone, email: req.body.email, }, req.params.id], (err, rows, field) => {
                    // error handling
                    if (err) {
                        return res.status(500).json({success: false, message: 'Ada kesalahan', error: err });
                    }

                    // jika update berhasil
                    res.status(200).json({ success: true, message: 'Berhasil update data!', data: { name: req.body.name, username: req.body.username, phone: req.body.phone, email: req.body.email } });
                });
            } else {
                return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
            }
        });
    }
}


//mengirim code verifikasi lewat gmail
const sendMail = async (req, res) => {
    const querySearch = 'SELECT * FROM `user` WHERE email="' + req.body.email + '"';

    const email = req.body.email;
    koneksi.query(querySearch, req.body.email, async (err, rows, field) => {

        if (rows.length == 0) {
            return res.status(500).json({ success: false, message: 'email anda tidak ada terdaftar', error: err });
        }



        const random = require("simple-random-number-generator");
        let params = {
            min: 1000,
            max: 9999,
            integer: true


        };
        const CodeRandom = random(params);
        const querySql = 'UPDATE user SET ? WHERE email = ?';

        koneksi.query(querySql, [{ code_verification: CodeRandom, }, req.body.email], (err, rows, field) => {
            // error handling
            if (err) {
                return res.status(500).json({ message: 'Gagal update code!', data: { code_verification: "" } });
            }


            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'appskepevent@gmail.com',
                    pass: 'oabnnmauqjymonzi'
                }
            });



            const mailOptions = {
                from: 'muthiazraihan27@gmail.com',
                to: req.body.email,
                subject: 'Kode Verifikasi Lupa Password',
                html: '<h2>Berikut kode reset password anda:</h2><h1>< ' + CodeRandom + '</h1> '


            };



            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err)
                    res.status(500).json({ message: 'Ada kesalahan', error: err })
                } else {

                    res.status(200).json({
                        success: true, data: rows[0]
                    })
                }

            })
        })
    })


};


//memasukan code verifikasi
const sendCodeVerification = async (req, res) => {

    const data = { ...req.body };

    const querySearch = 'SELECT * FROM `user` WHERE code_verification="' + req.body.code_verification + '"';

    // jalankan query
    koneksi.query(querySearch, [{ code_verification: req.body.code_verification }, req.body.code_verification], (err, rows, field) => {
        if (rows.length == 0) {
            return res.status(500).json({ success: false, message: 'Gagal memasukan kode verifikasi', error: err });
        }

        res.status(201).json({ success: true, message: 'Berhasil berhasil memasukan kode verifikasi' });

    })
};


//lupa password 
const forgetPassword = async (req, res) => {

    const saltRounds = 10;
    const bs = new BcryptSalt();
    const hashedPassword = bcrypt.hashSync(req.body.password_hash, bs.saltRounds);

    const data = { ...req.body };
    const querySearch = 'SELECT * FROM `user` WHERE id="' + req.body.id + '"';
    const queryUpdate = 'UPDATE user SET ? WHERE id = ?';

    koneksi.query(querySearch, [{ id: req.body.id }, req.body.id], (err, rows1, field) => {
        koneksi.query(queryUpdate, [{ id: req.body.id, password_hash: hashedPassword }, req.body.id], (err, rows, field) => {
            // error handling
            if (rows1.length == 0) {
                return res.status(500).json({ success: false, message: 'Gagal change password', error: err });
            }

            // jika request berhasil
            res.status(201).json({ success: true, message: 'Berhasil change password' });

        })
    })
};


//reset password ketika sudah login
const resetPassword = async (req, res) => { 
 
    const saltRounds = 10; 
    const bs = new BcryptSalt(); 
    const hashedPassword = bcrypt.hashSync(req.body.password_news, bs.saltRounds); 
 
 
    const data = { ...req.body }; 
    const querySearch = 'SELECT * FROM user WHERE id="' + req.body.id + '"'; 
    const queryUpdate = 'UPDATE user SET ? WHERE id = ?'; 
 
 
    koneksi.query(querySearch, async (err, rows1, field) => { 
 
        if (err) { 
            return res.status(500).json({ message: 'Gagal insert data!', error: err }); 
        } 
        if (rows1.length == 0) { 
            return res.status(500).json({ message: 'Gagal insert data!', error: err }); 
        } 
        const valid = await bcrypt.compare(req.body.password_hash, rows1[0].password_hash) 
 
        if (valid) { 
 
            koneksi.query(queryUpdate, [{ id: req.body.id, password_hash: hashedPassword, password_news: hashedPassword }, req.body.id], (err, rows, field) => { 
 
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


module.exports = { register, login, readUser, updateUser, sendMail, resetPassword, sendCodeVerification, forgetPassword }



