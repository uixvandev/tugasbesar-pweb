const express = require('express');
const bodyParser = require('body-parser');
const koneksi = require('../config/database');
const app = express();
const multer = require('multer');
const path = require('path');
const url = require('url');
const { time } = require('console');

// set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// membuat event user
const createRespon = (req, res) => {

    // buat variabel penampung data dan query sql
    const data = { ...req.body };
    const querySql = 'INSERT INTO signature SET ?';

    // jalankan query
    koneksi.query(querySql, { user_id: data.user_id, document_id: data.document_id, file_name: req.file.originalname }, (err, rows1, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ success: false, message: 'Gagal Mengirim respon form!', error: err });
        }

        // jika request berhasil
        res.status(201).json({ success: true, message: 'Berhasil Mengirim respon form', data: req.body });

    });
}


// update data
const actionRespon = (req, res) => {
    // buat variabel penampung data dan query sql
    const data = { ...req.body };
    const querySearch = 'SELECT * FROM signature WHERE user_id = ? AND document_id= ?';
    const queryUpdate = 'UPDATE signature SET ? WHERE id = ?';

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, [req.body.user_id, req.body.document_id], (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }
      

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {

            // jalankan query update
            koneksi.query(queryUpdate, [{ user_id: data.user_id, document_id: data.document_id, file_name: req.file.originalname, status:0 }, rows[0].id], (err, rows, field) => {
                // error handling
                if (err) {
                    return res.status(500).json({ success: false, message: 'Ada kesalahan', error: err });
                }

                // jika update berhasil
                res.status(200).json({ success: true, message: 'Berhasil update respon!', });
            });
        } else {
           createRespon(req, res)
        }
    });
}

const assignedSignature = (req, res) => {
    // buat variabel penampung data dan query sql
    const querySearch = 'SELECT * FROM signature WHERE id = ?';
    const queryUpdate = 'UPDATE signature SET ? WHERE id = ?';

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.body.id, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {

            // jalankan query update
            koneksi.query(queryUpdate, [{ status: req.body.status, signed_at: new Date().toISOString() }, req.body.id], (err, rows, field) => {
                // error handling
                if (err) {
                    return res.status(500).json({ success: false, message: 'Ada kesalahan', error: err });
                }

                // jika update berhasil
                res.status(200).json({ success: true, message: 'Berhasil update respon!', });
            });
        } else {
            return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
    });
}


const readResponId = (req, res) => {

    const querySearch = 'SELECT s.*, u.username, u.email FROM `signature` s LEFT JOIN users u ON s.user_id = u.id WHERE s.document_id="' + req.params.id + '"';

    koneksi.query(querySearch, (err, rows, field) => {
        // error handling
        if (err) {

            return res.status(500).json({ success: false, message: 'Ada kesalahan', error: err });

        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
}



module.exports = { createRespon, actionRespon, readResponId, assignedSignature }