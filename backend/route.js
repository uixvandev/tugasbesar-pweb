
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//server 
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));

module.exports = {apiuser}
module.exports = {apievent}
module.exports = {apievent_user}
module.exports = {apimidtrans_notification}

module.exports = {apigetuser}
module.exports = {apigetevent}
module.exports = {apigetevent_user}
module.exports = {apigetmidtrans_notification}

module.exports = {apiputuser}
module.exports = {apiputevent}
module.exports = {apiputevent_user}
module.exports = {apiputmidtrans_notification}

module.exports = {apideleteuser}
module.exports = {apideleteevent}
module.exports = {apideleteevent_user}
module.exports = {apidelettemidtrans_notification}

