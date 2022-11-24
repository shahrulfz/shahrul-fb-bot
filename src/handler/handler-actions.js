const fs = require('fs');
const path = require("path");
const sendEmail = require('../services/send-email');
const PRODUCT_DATA = require('../sample-data.json');
const files = fs.readdirSync(path.join(__dirname, "..", "chat-responses"));

function handleMessage(sender_psid, received_message) {
  try {
    console.log('handleMessage')
    let response;

    if (received_message.text) {
      console.log(received_message.text)
      for (const file of files) {
        let data = fs.readFileSync(path.join(__dirname, "..", "chat-responses", file));
        data = JSON.parse(data);

        // check if keyword exist
        const isFound = data.questions.some(question => {
          return question.toLowerCase() === received_message.text.toLowerCase();
        });
        console.log({isFound})
        if (isFound) {
          response = data.answers[Math.floor(Math.random() * data.answers.length)];
        }
        else response = "Please set response"
      }

      response = {
        "text": response
      }
    }

    return {
      "recipient": {
        "id": sender_psid
      },
      "message": response
    }
  }
  catch (err) {
    return err;
  }
}

function handleProduct(sender_psid, getProductID, action) {
  try {
    let response;
    const isExist = ({ sku }) => sku == getProductID;
    const getProductIndex = PRODUCT_DATA.findIndex(isExist);

    if (getProductIndex != -1) {
      if (action === "price") {
        response = "The price is " + PRODUCT_DATA[getProductIndex].price;
      }
      else if (action === "shipping") {
        response = "The shipping cost is " + PRODUCT_DATA[getProductIndex].shipping;
      }
      else if (action === "desc") {
        response = PRODUCT_DATA[getProductIndex].description;
      }
    }
    else {
      response = "Sorry, we cannot find what you are looking for. Please try again."
    }

    response = {
      "text": response
    }

    return returnOutput(sender_psid, response);
  }
  catch (err) {
    return err;
  }
}

function handleBuy(sender_psid, getProductID) {
  try {
    let response;
    const isExist = ({ sku }) => sku == getProductID;
    const getProductIndex = PRODUCT_DATA.findIndex(isExist);

    if (getProductIndex != -1) {
      const productDetails = PRODUCT_DATA[getProductIndex];
      response = "Your " + productDetails.name + " will be ship soon. We will contact you.....";
      productDetails.buyerID = sender_psid;
      sendEmail(productDetails)
    }
    else {
      response = "Sorry, we cannot find what you are looking for. Please try again.";
    }

    response = {
      "text": response
    }

    return returnOutput(sender_psid, response);
  }
  catch (err) {
    return err;
  }
}

function returnOutput(sender_psid, response) {
  return {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }
}
module.exports = {
  handleMessage, handleProduct, handleBuy
}