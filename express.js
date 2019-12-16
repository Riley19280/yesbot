const auth = require('./auth.json');
const config = require('./config.json');
const dbcmds = require('./database');
const util = require('./util');
const fs = require('fs-extra');
let http = require('http');
let https = require('https');

let privateKey  = fs.readFileSync('cert/server.key', 'utf8');
let certificate = fs.readFileSync('cert/server.crt', 'utf8');
let credentials = {key: privateKey, cert: certificate};


const express = require('express');
let bodyParser = require('body-parser')
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

let client
let httpServer
let httpsServer

module.exports.init = function (client1) {
    client = client1;

    httpServer = http.createServer(app);
    httpsServer = https.createServer(credentials, app);

//Set to 8080, but can be any port, code will only come over https, even if you specified http in your Redirect URI
    httpServer.listen(80);
    httpsServer.listen(443);
}


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/map.kml/:id', async (req,res) =>  {
    await util.locationKML(req.params.id)
});
