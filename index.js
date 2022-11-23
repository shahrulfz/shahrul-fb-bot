const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.send("Shahrul bot!");
});

app.listen(3000, () => console.log('Express server is listening on port 3000'));