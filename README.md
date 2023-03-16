# Team 15 Home

[View our Wiki here
](https://github.com/StanfordCS194/win2023-team15/wiki) <br>
THe Homepage of our Wiki contains information about our product and team and serves as a directory for the Wiki pages.

[View our Rapid Prototype Summary here
](https://docs.google.com/presentation/d/1GDyb13ec9v1C0KgXlOwE0DuArh_Dy2hFsdouI2vryrE/edit?usp=sharing)

## Git Source Control Assignment
Below is my name for the Git Source Control assigment. <br>
Jacob Chudnovsky <br>
Clemente Farias Canepa <br>
Dominic Reynaldo Terrones<br>
Clarisse Hokia <br>
Cat Fergesen <br>
## Stack

MERN
1. MongoDB
2. Express.js
3. React 
4. Node.js


## Getting it running
First thing is to make sure that the `.env` file lives in root.
Populate that file with the tokens Jacob emailed us. We have a `dotenv` package that takes care of everything else.
Also! Make sure you have all the dependencies installed
```
npm install
npm build
npm run start-full
```

If that doesn't work, for some reason, then follow the instructions below and troubleshoot.

1. Terminal Tab 1
```
cd frontend-react-draft  
npm start
```
2. Terminal Tab 2
```
cd server
npx ts-node src/server.ts
```
Make sure you do it in this order, or else you might get an error about an occupied port.

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

## Dependencies
    @testing-library/jest-dom: ^5.16.5,
    @testing-library/react: ^13.4.0,
    @testing-library/user-event: ^13.5.0,
    axios: ^1.3.4,
    concurrently: ^7.6.0,
    cors: ^2.8.5,
    dotenv: ^16.0.3,
    express: ^4.18.2,
    express-fileupload: ^1.4.0,
    form-data: ^4.0.0,
    jest: ^27.5.1,
    mongodb: ^5.0.0,
    mongoose: ^7.0.2,
    multer: ^1.4.5-lts.1,
    react: ^18.2.0,
    react-dom: ^18.2.0,
    react-router-dom: ^6.8.1,
    react-scripts: 5.0.1,
    twilio: ^3.84.1,
    web-vitals: ^2.1.4

## React

1. test: npm react-scripts test
2. start: npm react-scripts start
3. build: npm react-scripts build
4. eject: npm react-scripts eject

## Hosting

We use Heroku for hosting.

1. To run locally: `heroku local web`
2. To push changes to heroku: `git push heroku main`
3. To ensure at least one instance of the app is running: `heroku ps:scale web=1`
4. **To open app:** `heroku open`
