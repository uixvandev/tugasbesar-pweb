const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const url = require('url');
const cors = require("cors");

const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './document')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

const { register, login, profil, resetPassword, userSelf } = require('./modul/user');
const { createDocuments, updateDocument, readDocumentId, readDocuments, deleteDocumentId, readChekRespon } = require('./modul/document');
const { readResponId, assignedSignature, actionRespon } = require('./modul/signature');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/static', express.static(path.join(__dirname, 'document')))
//user
app.post('/api/register', register);
app.post('/api/login', login);
app.put('/api/user', profil);
app.get('/api/user/:id', userSelf);
app.put('/api/reset-password', resetPassword);

//document
app.post('/api/form', createDocuments);
app.put('/api/form', updateDocument);
app.get('/api/form', readDocuments);
app.get('/api/form/:id', readDocumentId);
app.delete('/api/form/:id', deleteDocumentId);

//cek
app.get('/api/check-respon', readChekRespon);

//signature
app.post('/api/respon', upload.single('file'), actionRespon);
app.put('/api/assigned-signature', assignedSignature);
app.get('/api/respon/:id', readResponId);


// Server Yang Berjalan
app.listen(3000);