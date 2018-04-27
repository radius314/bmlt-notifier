#BMLT Notifier

##Configuration

Below is a sample configuration file (should be called `config.js`).  You can also use any parameters for the `nodemailer`.  (ref: https://github.com/nodemailer/nodemailer).

You may want to set the `lastRun` file in this folder to be the current UNIX epoch (https://www.epochconverter.com).  Otherwise you will get a lot of emails on the first run.

```js
{
    "bmltServerRoot":"http://server:port/main_server",
    "nodeMailerTransportConfiguration": {
        "host":"",
        "port": "587",
        "secure":false,
        "requireTLS":true,
        "auth" : {
            "user": "",
            "pass": ""
        }
    },
    "nodeMailerMessageConfiguration": {
        "from": "",
        "to": "",
        "subject": ""
    },
    "webServerPort": "8080",
    "web": false,     // If false will run as an executable, useful for cron type jobs.
    "dryRun": false   // Will not update epoch or send email
}
```