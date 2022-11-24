const Sib = require('sib-api-v3-sdk')
require('dotenv').config()
const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.EMAIL_TOKEN;
const tranEmailApi = new Sib.TransactionalEmailsApi();

function sendEmail(data) {
    const sender = {
        email: 'shahrulefz@gmail.com',
        name: 'Sendinblue shahrul',
    }
    const receivers = [
        {
            email: 'shahrulefz@gmail.com',
        },
    ]

    tranEmailApi
        .sendTransacEmail({
            sender,
            to: receivers,
            subject: 'New Order',
            htmlContent: `
        <h1>New Order Requested</h1>
        <p>Product Name: ${data.name}</p>
        <p>Product Price: ${data.price}</p>
        <p>Shipping fee: ${data.shipping}</p>
        <p>Buyer: ${data.buyerID}</p>
                `
        }).then(function (data) {
            console.log('Email sent! Returned data: ' + JSON.stringify(data));
        }, function (error) {
            console.error(error);
        });
}

module.exports = sendEmail;