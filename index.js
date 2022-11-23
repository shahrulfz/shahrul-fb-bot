const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var config = require('./config/config.json');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const authenticateWebhook = require('./src/services/authenticate-webhook');
const handlerActions = require('./src/handler/handler-actions.js');

app.get('/', authenticateWebhook);

app.get('/bot', function (req, res) {
    res.send("Shahrul bot!");
});

app.post('/', (req, res) => {
    try {
        // Parse the request body from the POST
        let body = req.body;

        // Check the webhook event is from a Page subscription
        if (body.object === 'page') {

            // Iterate over each entry - there may be multiple if batched
            body.entry.forEach(function (entry) {

                // Gets the body of the webhook event
                let webhook_event = entry.messaging[0];
                // Get the sender PSID
                let sender_psid = webhook_event.sender.id;

                // Check if the event is a message or postback and
                // Task 1
                if (webhook_event.message) {
                    const getResult = handlerActions.handleMessage(sender_psid, webhook_event.message);
                    fetch('https://graph.facebook.com/v2.6/me/messages?access_token=' + config.PAGE_ACCESS_TOKEN, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(getResult),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            console.log('Success:', data);
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                } else if (webhook_event.postback) {
                    // no handling postback
                    res.sendStatus(404);
                }
            });
            res.status(200).send('EVENT_RECEIVED');

        } else {
            res.sendStatus(404);
        }
    }
    catch (err) {
        console.log(err);
        res.sendStatus(404);
    }
});

app.listen(3000, () => console.log('Express server is listening on port 3000'));