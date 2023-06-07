const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const url = require("url");
const cors = require("cors");

const { readUser, register, login, sendMail, resetPassword, sendCodeVerification, forgetPassword } = require('./modul/user');
// const multer = require('multer');
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './image')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname)
//   }
// })
// var upload = multer({ storage: storage })

// const { event_by_id } = require('./modul/event_by_id');
// const { readEvent_user, createEvent_user, roll_call, roll_call_leave, register_event, list_register_event, event_user_by_roll_call, event_user_by_absent, event_user_by_roll_call_leave } = require('./modul/event_user');
// const { readMidtrans_notification, createMidtrans_notification } = require('./modul/midtrans_notification');
// const { user_by_id } = require('./modul/user_by_id');

// const { updateUser } = require('./modul/user');
// const { create_event, readEvent, image, update_event, search_event, read_event_id, get_image } = require('./modul/event');
// const { updateEvent_user } = require('./modul/event_user');
// const { updateMidtrans_notification } = require('./modul/midtrans_notification');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//method post
app.post("/api/register", register);
app.post("/api/login", login);

// Server Yang Berjalan
app.listen(3000);
