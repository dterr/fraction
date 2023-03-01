import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { billRouter } from "./bill.routes";
import { connectToDatabase } from "./database";
import ReceiptModel, { default as Receipt } from "./receipt";

import { getOCR, convertOCRToBill } from "./helpers";
import multer from 'multer';

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
   console.error("No ATLAS_URI environment variable has been defined in config.env");
   process.exit(1);
}

var mongoose = require('mongoose');
//mongoose.connect(ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//connectToDatabase(ATLAS_URI)
mongoose.connect(ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => {
       const app = express();
       app.use(cors());

       app.use("/bills", billRouter);

       let port = parseInt("5000");
       if (port == null || String(port) == "") {
         port = 5200;
       }

       var path = require('path')

       const multer = require('multer')
         const storage = multer.diskStorage({
         dest: function (req, file, cb) {
            cb(null, 'uploads/')
         },
         filename: function (req, file, cb) {
            cb(null, file.originalname)
         }
         })
         const upload = multer({storage: storage})

       app.post('/api/receipt', upload.single('file'), async (req: express.Request, res: express.Response) => {
         try {
            //const { filePath, tip, phoneNumber } = req.body;
            console.log("Request", req);
            const file = req.file;
            const tip = 1; //TODO GET TIP
            const filePath = file ? file.path : "server/src/upload/test.png";
            console.log("Filepath!", filePath);

            let bill;
       
            // Send receipt for OCR and get text body of receipt
            //const receiptBody = getOCR(3000, filePath).then();
            //console.log(receiptBody);
            const receiptBody = await getOCR(3000, filePath);
            bill = convertOCRToBill(receiptBody, tip);
            console.log("\n\n\n\n", bill);

            // TODO get username on the front end
            // Save receipt to database
            const newReceipt = new ReceiptModel({
                  creatorName: "DominicTest1",
                  establishment: "McDonalds",
                  total: 100,
                  subtotal: bill._subTotal,
                  cash: 0,
                  change: 0,
                  tax: bill._tax,
                  tip: bill._tip,
                  currency: "USD",
                  lineItems: bill._orders.map((item) => ({
                  lineTotal: item._total,
                  desc: item._name,
                  qty: item._quantity,
                  price: item._price,
                  unit: "item",
                  payers: bill._payees ? bill._payees.map((payee) => payee._name) : [],
                  })),
               });

            console.log("About to save: %O",newReceipt);

            await newReceipt.save();
           
            // Return response with success message
            res.status(200).json({ message: "Receipt processed successfully!" });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error processing receipt" });
          }
        });

      // Queries database for a receipt of a given name
      // It queries for the user who presses the submit button
      // Request.body has receiptID and map of string to boolean
      app.post('/receipt/claimItems', function(request, response) {
         console.log("Received request" + JSON.stringify(request.body));
         ReceiptModel.findOne({_id: new mongoose.Types.ObjectId(request.body.receiptID)})
           .select("creatorName lineItems")
           .then(function (receipt) {
             if (!receipt) {
               console.log("Could not find receipt with id: " + request.body.receiptID);
               response.status(400).send('Receipt not found');
               return;
             }
             for (let i = 0; i < receipt.lineItems.length; i++) {
               if (request.body.items[receipt.lineItems[i].desc]) {
                 receipt.lineItems[i].payers.push(request.body.user);
               }
             }
             receipt.save();
             response.status(200).send(receipt);
           })
           .catch(function (err: Error) {
             console.log(err);
             response.status(500).send('Error occurred while processing the request');
           });
       });
         
       app.get('/receipt/listItems/:receiptID', function(request, response) {
        console.log("Getting receipt items");
         var id = request.params.receiptID;
         if (id === "" || !request.params.receiptID) {
           response.status(401).send("List items request was not given a receipt ID");
           return;
         }
         Receipt.find({_id: new mongoose.Types.ObjectId(id)}).select("_id lineItems").then(function (receipt) {
            if (!receipt) {
               console.log("Could not find receipt with id: " + request.body.receiptID);
               response.status(400).send('Receipt not found');
               return;
            } else {
             console.log(JSON.stringify(receipt));
             response.status(200).send(receipt);
           }
         });
      });

       // start the Express server
       app.listen(port, () => {
           console.log(`Server running at http://localhost:${port}...`);
       });

       app.get('/', function (req, res) {
        // res.render('index', {});
        res.status(201).send("Hello");
      });

   })
   .catch(error => console.error("Didn't connect to Mongo" + error));