#BMLT Notifier

##Configuration

Below is a sample configuration file.  You can also use any parameters for the `nodemailer`.  (ref: https://github.com/nodemailer/nodemailer)

```json
exports.settings = {
    "port":8080
    "bmltServerRoot":"http://hostname:port/main_server",
    "nodeMailerTransportConfiguration": {
        "host":'',
        "port": 587,
        "secure":false,
        "requireTLS":true,
        "auth" : {
            user: '',
            pass: ''
        }
    },
    "nodeMailerMessageConfiguration": {
        from: ',
        to: '',
        subject: 'M'
    }
};
```