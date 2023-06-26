const express = require('express');
const bodyParser = require('body-parser');
const koneksi = require('../config/database');
const app = express();
const multer = require('multer');
const path = require('path');
const url = require('url');

// set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// membuat event user
const createDocuments = (req, res) => {

    // buat variabel penampung data dan query sql
    const data = { ...req.body };
    const querySql = 'INSERT INTO documents SET ?; SELECT LAST_INSERT_ID() as id;';

    // jalankan query
    koneksi.query(querySql, data, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ success: false, message: 'Gagal Membuat Form!', error: err });
        }
        const id = rows[1][0].id;
        // jika request berhasil
        res.status(201).json({ success: true, message: 'Berhasil Membuat Form!', data: { ...req.body, id } });

    });
}


// read data
const readDocuments = (req, res) => {
    // buat query sql
    const querySql = 'SELECT d.*, count(s.document_id)as response FROM documents d LEFT JOIN signature s ON d.id = s.document_id GROUP BY d.id';

    // jalankan query
    koneksi.query(querySql, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ success: false, message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json(rows);
    });
}


// update data
const updateDocument = (req, res) => {
    // buat variabel penampung data dan query sql
    const data = { ...req.body };
    const querySearch = 'SELECT * FROM documents WHERE id = ?';
    const queryUpdate = 'UPDATE documents SET ? WHERE id = ?';

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.body.id, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {

            // jalankan query update
            koneksi.query(queryUpdate, [data, req.body.id], (err, rows, field) => {
                // error handling
                if (err) {
                    return res.status(500).json({ success: false, message: 'Ada kesalahan', error: err });
                }

                // jika update berhasil
                res.status(200).json({ success: true, message: 'Berhasil update data Form!', });
            });
        } else {
            return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
    });
}


const readDocumentId = (req, res) => {

    const querySearch = 'SELECT d.*, s.document_id FROM documents d LEFT JOIN signature s ON d.id = s.document_id WHERE d.id="' + req.params.id + '"LIMIT 1';

    koneksi.query(querySearch, (err, rows, field) => {
        // error handling
        if (err) {

            return res.status(500).json({ success: false, message: 'Ada kesalahan', error: err });

        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
}

const deleteDocumentId = (req, res) => {

    const querySearch = 'DELETE FROM `documents` WHERE id="' + req.params.id + '"';

    koneksi.query(querySearch, (err, rows, field) => {
        // error handling
        if (err) {

            return res.status(500).json({ success: false, message: 'Ada kesalahan', error: err });

        }

        const querySearch1 = 'DELETE FROM `signature` WHERE document_id="' + req.params.id + '"';

        koneksi.query(querySearch1, (err, rows, field) => {
            // error handling
            if (err) {

                return res.status(500).json({ success: false, message: 'Ada kesalahan', error: err });

            }
        });
        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
}

const readChekRespon = (req, res) => {

    const querySearch = 'SELECT * FROM signature s WHERE document_id="' + req.query.documentid + '" AND user_id="' + req.query.userid + '"';

    koneksi.query(querySearch, (err, rows, field) => {
        // error handling
        if (err) {

            return res.status(500).json({ success: false, message: 'Ada kesalahan', error: err });

        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows.length === 0 ? null : rows });
    });
}

module.exports = { createDocuments, readDocuments, updateDocument, readDocumentId, deleteDocumentId, readChekRespon }