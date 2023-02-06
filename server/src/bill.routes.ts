import * as express from "express";
import * as mongodb from "mongodb";
import * as dotenv from "dotenv";
import { Bill } from "./bill";
import {UploadedFile} from "express-fileupload";
import { collections } from "./database";

const fileUpload = require('express-fileupload');

const fs = require("fs");
const FormData = require('form-data');
const axios = require('axios');

export const billRouter = express.Router();
billRouter.use(express.json());
billRouter.use(fileUpload({
        limits: {
            fileSize: 10000000, // Around 10MB
        },
        abortOnLimit: true,
    }));

dotenv.config();

const { TWILIO_SID_MAIN, TWILIO_TOKEN_MAIN, TWILIO_NUMBER, TABSCANNER_API_KEY } = process.env;
const twilio_client = require('twilio')(TWILIO_SID_MAIN, TWILIO_TOKEN_MAIN);

function sleep(ms: Number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getOCR(ms: Number, filePath: String): any {
  var data = new FormData();
  //ex: server/src/upload/test.png
  data.append('file', fs.createReadStream(filePath));
  var config = {
    method: 'post',
    url: 'https://api.tabscanner.com/api/2/process',
    headers: {
     'apikey': TABSCANNER_API_KEY
     // add language, resolution, etc
    },
    data : data
  };

  let token = await axios(config).then(function (response: any) {
    return response.data.token;
  }) .catch(function (error: any) {
    console.log(error);
  });

  await sleep(ms);

  var config2 = {
    method: 'get',
    url: `https://api.tabscanner.com/api/result/${token}`,
    headers: {
     'apikey': TABSCANNER_API_KEY
    }
  };

  let receiptBody = await axios(config2).then(function (response: any) {
    return response.data.result;
  }) .catch(function (error: any) {
    console.log(error);
  });

  return receiptBody;
}

// billRouter.get("/", async (_req, res) => {
//    try {
//
//    } catch (error) {
//        res.status(500).send(error.message);
//    }
// });

billRouter.get("/:id", async (req, res) => {
   try {
       const id = req?.params?.id;
       const query = { _id: new mongodb.ObjectId(id) };
       const bill = await collections.bills.findOne(query);

       if (bill) {
           res.status(200).send(bill);
       } else {
           res.status(404).send(`Failed to find a bill: ID ${id}`);
       }

   } catch (error) {
       res.status(404).send(`Failed to find a bill: ID ${req?.params?.id}`);
   }
});

billRouter.post("/", async (req, res) => {
   try {
       // Get the file that was set to our field named "image"
       const image = req.files.image as UploadedFile
       const { phoneNumbers } = req.body;

       // If no image submitted, exit
       if (!image) return res.sendStatus(400);

       // If does not have image mime type prevent from uploading
       if (/^image/.test(image.mimetype)) return res.sendStatus(400);

       // Move the uploaded image to our upload folder
       let filePath = __dirname + '/upload/' + image.name
       image.mv(filePath);

       // Do OCR on the image and get back JSON parse of image from OCR
       let receiptBody = await getOCR(10000, filePath);

       // Scrape relevant structure from receiptBody
       //
       const bill: Bill = {}

       const result = await collections.bills.insertOne(bill);

       if (result.acknowledged) {
           res.status(201).send(`Created a new bill: ID ${result.insertedId}.`);

           // Send SMS messages
           for (const phoneNumber in phoneNumbers){
             twilio_client.messages
              .create({
                body: `http://localhost:5200/bills/${result.insertedId}`, // Link to generated ID - REPLACE WITH ACTUAL DOMAIN
                to: `+1${phoneNumber}`, // Text this number like +12345678901
                from: TWILIO_NUMBER, // From a valid Twilio number
              })
              .then((message: any) => console.log(message.sid));
           }

           // Redirect to link?

       } else {
           res.status(500).send("Failed to create a new bill.");
       }
   } catch (error) {
       console.error(error);
       res.status(400).send(error.message);
   }
});

billRouter.put("/:id", async (req, res) => {
   try {
       const id = req?.params?.id;
       const bill = req.body;
       const query = { _id: new mongodb.ObjectId(id) };
       const result = await collections.bills.updateOne(query, { $set: bill });

       if (result && result.matchedCount) {
           res.status(200).send(`Updated an bills: ID ${id}.`);
       } else if (!result.matchedCount) {
           res.status(404).send(`Failed to find a bill: ID ${id}`);
       } else {
           res.status(304).send(`Failed to update a bill: ID ${id}`);
       }
   } catch (error) {
       console.error(error.message);
       res.status(400).send(error.message);
   }
});

billRouter.delete("/:id", async (req, res) => {
   try {
       const id = req?.params?.id;
       const query = { _id: new mongodb.ObjectId(id) };
       const result = await collections.bills.deleteOne(query);

       if (result && result.deletedCount) {
           res.status(202).send(`Removed a bill: ID ${id}`);
       } else if (!result) {
           res.status(400).send(`Failed to remove a bill: ID ${id}`);
       } else if (!result.deletedCount) {
           res.status(404).send(`Failed to find a bill: ID ${id}`);
       }
   } catch (error) {
       console.error(error.message);
       res.status(400).send(error.message);
   }
});
