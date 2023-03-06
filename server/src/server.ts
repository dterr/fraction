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
                  creatorName: req.body.name,
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
      app.post('/receipt/claimItems/:json', function(request, response) {
        var json = JSON.parse(request.params.json);
         console.log("Received request for claim items " + JSON.stringify(json));
         ReceiptModel.findOne({_id: new mongoose.Types.ObjectId(json.receiptID)})
           .select("creatorName lineItems")
           .then(function (receipt) {
             if (!receipt) {
               console.log("Could not find receipt with id: " + json.receiptID);
               response.status(400).send('Receipt not found');
               return;
             }
             for (let i = 0; i < json.items.length; i++) {
              if (json.items[i].isChecked) {
                console.log("Item: " + json.items[i].desc + " is checked");
                for(var j = 0; j < receipt.lineItems.length; j++) {
                  if (receipt.lineItems[j].desc === json.items[i].desc && !receipt.lineItems[j].payers.includes(json.user))
                    receipt.lineItems[j].payers.push(json.user);
                }
              } else {
                console.log("Item: " + json.items[i].desc + " is not checked");
                for(var j = 0; j < receipt.lineItems.length; j++) {
                  if (receipt.lineItems[j].desc === json.items[i].desc && receipt.lineItems[j].payers.includes(json.user))
                    receipt.lineItems[j].payers = receipt.lineItems[j].payers.filter((value, index, arr) => value !== json.user);
                }
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
         
       app.get('/receipt/listItems/:json', function(request, response) {
         //console.log("Received request for list items: " + request.params.json);
         var json = JSON.parse(request.params.json);
         var id = json.receiptID;
         var username = json.user;
         if (id === "" || !request.params.json) {
           response.status(401).send("List items request was not given a receipt ID");
           return;
         }
         Receipt.findOne({_id: new mongoose.Types.ObjectId(id)}).select("_id lineItems").then(function (receipt) {
            if (!receipt) {
               console.log("Could not find receipt with id: " + request.body.receiptID);
               response.status(400).send('Receipt not found');
               return;
            } else {
             var lineItemsList = new Array();
             for (var item of receipt.lineItems) {
              lineItemsList.push({desc: item.desc, isChecked: item.payers.includes(username)});
             }
             response.status(200).send({lineItems: lineItemsList});
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