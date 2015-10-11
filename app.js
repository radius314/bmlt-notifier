var request = require("superagent");
var fs = require("fs");
var moment = require("moment");
var nodemailer = require("nodemailer");
var config = require("./config.js").settings;

var today = "2015-10-09" //moment().format("YYYY-MM-DD");
var lastRunEpoch = 1444423781; //load from file
console.log(today);

request
    .get(config.bmltServerRoot + "/client_interface/json/?switcher=GetChanges&start_date=" + today)
    .type("json")
    .end(processChanges);

function processChanges(err, res) {
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
    var transporter = nodemailer.createTransport(config.nodeMailerTransportConfiguration);
    var sendMessageConfiguration = config.nodeMailerMessageConfiguration;
    sendMessageConfiguration.html = message;
    transporter.sendMail(sendMessageConfiguration);
}

function saveCurrentEpoch() {
    var newEpoch = (new Date).getTime();
    // save to file here
}