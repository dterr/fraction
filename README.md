# Team 15 Home

[View our Wiki here
](https://github.com/StanfordCS194/win2023-team15/wiki)

## Stack

MERN
1. MongoDB
2. Express.js
3. React 
4. Node.js


## Set Up

1. Installing Dependencies:  

`npm install cors dotenv express mongodb twilio express-fileupload axios form-data`

`npm install --save-dev typescript @types/cors @types/express @types/node ts-node`

2. Add .env file in /server

3. Add `ATLAS_URI = mongodb+srv://<username>:<password>@cs194.2dvr2.mongodb.net/?retryWrites=true&w=majority`

4. Run the server by typing `npx ts-node src/server.ts` in the command line. You should see "Server running at http://localhost:5200"

## Services

1. Database: [Mongo DB Atlas](https://www.mongodb.com/cloud/atlas/register) Cloud Cluser
2. OCR (Optical Character Recognition): [TabScanner API](https://tabscanner.com/)
3. SMS Texting: [Twilio API](https://www.twilio.com/en-us/messaging/channels/sms)
