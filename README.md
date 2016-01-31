#BMLT Notifier

##Configuration

```json
exports.settings = {
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