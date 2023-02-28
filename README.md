# Team 15 Home

[View our Wiki here
](https://github.com/StanfordCS194/win2023-team15/wiki)

[View our Rapid Prototype Summary here
](https://docs.google.com/presentation/d/1GDyb13ec9v1C0KgXlOwE0DuArh_Dy2hFsdouI2vryrE/edit?usp=sharing)

## Git Source Control Assignment
Below is my name for the Git Source Control assigment.
Clemente Farias Canepa
[Dominic Reynaldo Terrones](./dom.com)
Clarisse Hokia 
Cat Fergesen
## Stack

MERN
1. MongoDB
2. Express.js
3. React 
4. Node.js


## Set Up

1. Installing Dependencies:  
    ```
    npm install cors dotenv express mongodb twilio express-fileupload axios form-data
    npm install --save-dev typescript @types/cors @types/express @types/node ts-node
    ```

2. Add .env file in /server

3. Add to .env 

    ```
    ATLAS_URI = mongodb+srv://<username>:<password>@cs194.2dvr2.mongodb.net/?retryWrites=true&w=majority
    TWILIO_SID_MAIN = <ASK JACOB>
    TWILIO_TOKEN_MAIN = <ASK JACOB>
    TWILIO_NUMBER = 18559195785
    TABSCANNER_API_KEY = <ASK JACOB>
    ```

4. Run the server by typing `npx ts-node src/server.ts` in the command line. You should see `Server running at http://localhost:5000`

## Services

1. Database: [Mongo DB Atlas](https://www.mongodb.com/cloud/atlas/register) Cloud Cluser
2. OCR (Optical Character Recognition): [TabScanner API](https://tabscanner.com/)
3. SMS Texting: [Twilio API](https://www.twilio.com/en-us/messaging/channels/sms)

## Hosting

We use Heroku for hosting.

1. To run locally: `heroku local web`
2. To push changes to heroku: `git push heroku main`
3. To ensure at least one instance of the app is running: `heroku ps:scale web=1`
4. **To open app:** `heroku open`
