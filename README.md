#BMLT Notifier

##Configuration

Below is a sample configuration file.  You can also use any parameters for the `nodemailer`.  (ref: https://github.com/nodemailer/nodemailer)

```json
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
    }
}
```