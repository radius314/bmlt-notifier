var request = require("superagent");
var fs = require("fs");
var http = require('http');
var moment = require("moment");
var nodemailer = require("nodemailer");
var dateFormat = require('dateformat');
var today;
var lastRunEpoch;
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

log("loading config")

var config = JSON.parse(fs.readFileSync("config.js"));
log("config loaded: " + JSON.stringify(config));

if (config.web) {
    http.createServer(function (req, res) {
        log("request received");
        getAndProcessDiffs()
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end("ok");
    }).listen(config.webServerPort);
} else {
    getAndProcessDiffs();
}

function getAndProcessDiffs(callback) {
    today = moment().format("YYYY-MM-DD");

    loadCurrentEpoch(function (data) {
        lastRunEpoch = data;
        if (!config.dryRun) saveCurrentEpoch();
        request
            .get(config.bmltServerRoot + "/client_interface/json/?switcher=GetChanges&start_date=" + today)
            .type("json")
            .end(processChanges);
    });
}

function processChanges(err, res) {
    log("processing changes.")
    var changesData = JSON.parse(res.text);

    for (var name in changesData) {
        if (changesData[name].date_int >= lastRunEpoch) {
            var data = "<br><b>Change Time:</b> " + changesData[name].date_string;
            data += "<br><b>Meeting ID:</b> " + changesData[name].meeting_id;
            data += "<br><b>Meeting Name:</b> " + changesData[name].meeting_name;
            data += "<br><b>Service Body Name:</b> " + changesData[name].service_body_name;
            data += "<br><b>Change Made By:</b> " + changesData[name].user_name;
            data += "<br><b>Change:</b> " + changesData[name].details;
            data += "<br><table border='1'>";
            data += "<tr><th>";
            for (var attribute in changesData[name].json_data.before) {
                data += "<th>" + attribute;
            }

            data += "<tr><th>Before";
            for (var attribute in changesData[name].json_data.before) {
                data += "<td>" + changesData[name].json_data.before[attribute];
            }

            data += "<tr><th>After";
            for (var attribute in changesData[name].json_data.after) {
                data += "<td>" + changesData[name].json_data.after[attribute];
            }

            data += "</table>";
            console.log("Change occurred: " + data);
            if (!config.dryRun) {
                sendMail(data);
            } else {
                console.log(data)
            }
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
    var timestamp = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss TT");
    fs.appendFile('bmlt-notifier.log', timestamp + ": " + message + "\r\n", function (err) {
        if (err) throw err;
    });
}
