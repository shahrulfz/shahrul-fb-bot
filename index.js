const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config/config.json');
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const authenticateWebhook = require('./src/services/authenticate-webhook');
const handlerActions = require('./src/handler/handler-actions.js');

app.get('/', authenticateWebhook);

app.get('/bot', function (req, res) {
    res.send("Shahrul bot!");
});

app.get('/task2', function (req, res) {
    res.status(200).send("Please use POST to this path. Sample data: " + JSON.stringify([
        {
            "id": 3,
            "sourceAccount": "A",
            "targetAccount": "B",
            "amount": 100,
            "category": "eating_out",
            "time": "2018-03-02T10:34:30.000Z"
        },
        {
            "id": 1,
            "sourceAccount": "A",
            "targetAccount": "B",
            "amount": 100,
            "category": "eating_out",
            "time": "2018-03-02T10:33:00.000Z"
        },
        {
            "id": 6,
            "sourceAccount": "A",
            "targetAccount": "C",
            "amount": 250,
            "category": "other",
            "time": "2018-03-02T10:33:05.000Z"
        },
        {
            "id": 4,
            "sourceAccount": "A",
            "targetAccount": "B",
            "amount": 100,
            "category": "eating_out",
            "time": "2018-03-02T10:36:00.000Z"
        },
        {
            "id": 2,
            "sourceAccount": "A",
            "targetAccount": "B",
            "amount": 100,
            "category": "eating_out",
            "time": "2018-03-02T10:33:50.000Z"
        },
        {
            "id": 5,
            "sourceAccount": "A",
            "targetAccount": "C",
            "amount": 250,
            "category": "other",
            "time": "2018-03-02T10:33:00.000Z"
        }
    ]));
});

function custom_sort(a, b) {
    return new Date(a.time).getTime() - new Date(b.time).getTime();
}

function itemToHash(item) {
    return `${item.sourceAccount}#${item.targetAccount}#${item.category}#${item.amount}`;
}

function findDuplicateTransactions(transactions = []) {
    let sortedArray = transactions.sort(custom_sort);
    const hashedItems = {};

    for (let i = 0; i < sortedArray.length; i++) {
        const item = sortedArray[i];
        const itemHash = itemToHash(item);
        if (!hashedItems[itemHash]) {
            hashedItems[itemHash] = [item];
        } else {
            const last = hashedItems[itemHash][(hashedItems[itemHash].length - 1)];
            if (new Date(item.time) - new Date(last.time) <= 1000 * 60) {
                hashedItems[itemHash].push(item);
            }
        }
    }
    let result = [];
    for (let res of Object.values(hashedItems)) {
        result.push(res);
    }
    return result;
}

app.post('/task2', (req, res) => {
    const getNewData = findDuplicateTransactions(req.body);

    try {
        res.status(200).send(getNewData);
    }
    catch (err) {
        console.error(err);
        res.sendStatus(404);
    }
})
app.post('/', (req, res) => {
    try {
        console.log("Accessing index")
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

                if (webhook_event.message) {
                    let text = webhook_event.message.text.toLowerCase().split(" ");
                    let checkDesc = text.indexOf("desc");
                    let checkPrice = text.indexOf("price");
                    let checkShipping = text.indexOf("shipping");
                    let checkBuy = text.indexOf("buy");
                    let action;
                    let getResult;
                    let getProductID;

                    if (checkBuy != -1) {
                        action = "buy";
                        getProductID = (checkBuy !== -1) ? text[checkBuy + 1] : null;
                    }
                    else if (checkDesc != -1) {
                        action = "desc";
                        getProductID = (checkDesc !== -1) ? text[checkDesc + 1] : null;
                    }
                    else if (checkPrice != -1) {
                        action = "price";
                        getProductID = (checkPrice !== -1) ? text[checkPrice + 1] : null;
                    }
                    else if (checkShipping != -1) {
                        action = "shipping";
                        getProductID = (checkShipping !== -1) ? text[checkShipping + 1] : null;
                    }

                    // Task 1 - For simple greetings
                    if (!action) {
                        getResult = handlerActions.handleMessage(sender_psid, webhook_event.message);
                    }
                    // Task 2
                    else {
                        if (action && action !== "buy") {
                            getResult = handlerActions.handleProduct(sender_psid, getProductID, action);
                        }
                        else if (action === "buy") {
                            getResult = handlerActions.handleBuy(sender_psid, getProductID);
                        }
                        else {
                            getResult = {
                                "recipient": {
                                    "id": sender_psid
                                },
                                "message": "Sorry, we cannot find what you are looking for. Please try again."
                            };
                        }
                    }

                    fetch('https://graph.facebook.com/v2.6/me/messages?access_token=' + process.env.PAGE_ACCESS_TOKEN, {
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
        console.log("Error found:", err);
        res.sendStatus(404);
    }
});

app.listen(3000, () => console.log('Express server is listening on port 3000'));

module.exports = app;