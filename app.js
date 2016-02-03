var request = require("superagent");
var fs = require("fs");
var http = require('http');
var moment = require("moment");
var nodemailer = require("nodemailer");
var dateFormat = require('dateformat')
var config = require("./config.js").settings;

var today;
var lastRunEpoch;

http.createServer(function (req, res) {
    log("request received");
    today = moment().format("YYYY-MM-DD");

    loadCurrentEpoch(function(data) {
        lastRunEpoch = data;
        saveCurrentEpoch();
        request
            .get(config.bmltServerRoot + "/client_interface/json/?switcher=GetChanges&start_date=" + today)
            .type("json")
            .end(processChanges);


        res.writeHead(200, {'Content-Type': 'text/plain'} );
        res.end("ok");
    });
}).listen(config.port);

function processChanges(err, res) {
    log("processing changes.")
    var changesData = JSON.parse(res.text);

    for (var name in changesData) {
        if (changesData[name].date_int >= lastRunEpoch) {
            var data = "<br><b>Change Time:</b> " + changesData[name].date_string;
            data += "<br><b>Meeting ID:</b> " + changesData[name].meeting_id;
            data += "<br><b>Meeting Name:</b> " + changesData[name].meeting_name;
            data += "<br><b>Change:</b> " + changesData[name].details;
            console.log("Change occurred: " + data);
            sendMail(data);
        }
    }
}

function sendMail(message) {
    log("sending email");
    var transporter = nodemailer.createTransport(config.nodeMailerTransportConfiguration);
    var sendMessageConfiguration = config.nodeMailerMessageConfiguration;
    sendMessageConfiguration.html = message;
    transporter.sendMail(sendMessageConfiguration);
}

function saveCurrentEpoch() {
    log("saving current epoch");
    var newEpoch = (new Date).getTime();
    fs.writeFile("lastRun", newEpoch)
}

function loadCurrentEpoch(callback) {
    log("loading current epoch");
    fs.readFile("lastRun", function (err, data) {
        if (err) {
            throw err;
        }
        callback(data.toString());
    });
}

function log(message) {
    var timestamp = dateFormat(new Date(), "yyyy-MM-dd h:MM:ss TT");
    fs.appendFile('bmlt-notifer.log', timestamp + ": " + message + "\r\n", function (err) {
        if (err) throw err;
    });
}