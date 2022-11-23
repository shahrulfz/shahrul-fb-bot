const fs = require('fs');
const path = require("path");

const files = fs.readdirSync(path.join(__dirname, "..", "chat-responses"));

function handleMessage(sender_psid, received_message) {
  try {
    let response;

    if (received_message.text) {

      for (const file of files) {
        let data = fs.readFileSync(path.join(__dirname, "..", "chat-responses", file));
        data = JSON.parse(data);
        const isFound = data.questions.some(question => {
          return question.toLowerCase() === received_message.text.toLowerCase();
        });
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

module.exports = {
  handleMessage
}