## Getting Started
For developer:

First, run
```bash
npm install
```

Then, run the development server:

```bash
npm start
```

For Task 1

a) Can use ngrok to run locally

or

b) Add https://shahrul-fb-bot.vercel.app/ to facebook messenger to act as webhooks

c) Send message to this page https://www.facebook.com/profile.php?id=100088337161275
i) sample message 

```bash
hi/hello/good morning
```

ii) sample message 
```bash
desc/shipping/price <product id>
```

iii) sample message(an email will be send to receiver as in send-email.js)
```bash
buy <product id>
```
Please send environmental variable for 
PAGE_ACCESS_TOKEN
EMAIL_TOKEN

For Task 2

POST to /task2 by sending correct data through body
Sample data
```bash
 [{"id":3,"sourceAccount":"A","targetAccount":"B","amount":100,"category":"eating_out","time":"2018-03-02T10:34:30.000Z"},{"id":1,"sourceAccount":"A","targetAccount":"B","amount":100,"category":"eating_out","time":"2018-03-02T10:33:00.000Z"},{"id":6,"sourceAccount":"A","targetAccount":"C","amount":250,"category":"other","time":"2018-03-02T10:33:05.000Z"},{"id":4,"sourceAccount":"A","targetAccount":"B","amount":100,"category":"eating_out","time":"2018-03-02T10:36:00.000Z"},{"id":2,"sourceAccount":"A","targetAccount":"B","amount":100,"category":"eating_out","time":"2018-03-02T10:33:50.000Z"},{"id":5,"sourceAccount":"A","targetAccount":"C","amount":250,"category":"other","time":"2018-03-02T10:33:00.000Z"}]
 ```
