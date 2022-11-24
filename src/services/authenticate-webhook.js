const config = require('../../config/config.json');

const authenticateWebhook = (req, res) => {
    try {
        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];

        if (mode && token === config.verifyToken) {
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
    catch (err) {
        console.log(err);
        res.sendStatus(404);
    }
};

module.exports = authenticateWebhook;