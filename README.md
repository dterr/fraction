# Team 15 Home

[View our Wiki here
](https://github.com/StanfordCS194/win2023-team15/wiki)

## Set Up

Based on https://www.mongodb.com/languages/mean-stack-tutorial


1. Installing Dependencies:  

`npm install cors dotenv express mongodb twilio express-fileupload axios`

`npm install --save-dev typescript @types/cors @types/express @types/node ts-node`

2. Add .env file in /server

3. Add `ATLAS_URI = mongodb+srv://<username>:<password>@cs194.2dvr2.mongodb.net/?retryWrites=true&w=majority`

4. Run the server by typing `npx ts-node src/server.ts` in the command line. You should see "Server running at http://localhost:5200"



## Twilio number


### Set Up

````md
// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();

const { TWILIO_SID_MAIN, TWILIO_TOKEN_MAIN, TWILIO_NUMBER } = process.env;
const client = require('twilio')(TWILIO_SID_MAIN, TWILIO_TOKEN_MAIN);

client.messages
  .create({
    body: <LINK TO GENERATED BILL>,
    to: <PHONE NUMBER OF OTHER PEOPLE AT DINNER>, // Text this number like +12345678901
    from: TWILIO_NUMBER, // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));
````
