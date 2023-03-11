//@ts-nocheck
import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { billRouter } from "./bill.routes";
import { connectToDatabase } from "./database";
import ReceiptModel, { default as Receipt } from "./receipt";
import { Bill, Item } from "./bill"
import ObjectId from "mongodb";

import { getOCR, convertOCRToBill } from "./helpers";
import multer from 'multer';


var path = require('path')

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();

const { ATLAS_URI } = process.env;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

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

       let port = parseInt("3000");
       if (port == null || String(port) == "") {
         port = 5200;
       }

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
            
            const file = req.file;
            const tip = req.body.tip; //TODO GET TIP
            const filePath = file ? file.path : "server/src/upload/test.png";

            if (req.body.test) {
              console.log("Test run detected, skipping OCR . . .", req.body.test);
              res.status(200).json({ message: `Receipt processed without OCR`, link: `https://fifteen.herokuapp.com/bills/test1`});
            } else  {
        
            // Send receipt for OCR and get text body of receipt                        
            const receiptBody = await getOCR(3000, filePath);
            const bill = convertOCRToBill(receiptBody, tip);

            // TODO get username on the front end
            // Save receipt to database
            const newReceipt = new ReceiptModel({
                  isOpen: true,
                  creatorName: req.body.name,
                  establishment: bill._store,
                  total: bill._total,
                  subtotal: bill._subTotal,
                  cash: bill._cash,
                  change: bill._change,
                  tax: bill._tax,
                  tip: bill._tip,
                  currency: "USD",
                  lineItems: bill._orders.map((item: Item) => ({
                     lineTotal: item._totalPrice,
                     desc: item._desc,
                     qty: item._qty,
                     price: item._pricePerItem,
                     unit: "item",
                     payers: bill._payees ? bill._payees.map((payee) => payee._name) : [],
                     })),
               });

               console.log("%cAbout to save the following: ", "color:red;font-size:50;");
               console.log("%O", newReceipt);

            const result = await newReceipt.save();
            console.log("Successfully saved. Here is the receipt: %O", result.id);
            // Return response with success message
            res.status(200).json({ message: `Receipt processed successfully!`, link: `https://fifteen.herokuapp.com/bills/${result.id}`});
            }
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
       app.listen((process.env.PORT || port), () => {
           console.log(`Server running at http://localhost:${port}...`);
       });


       /* Dominic's Note
       * I'm not really sure what I'm doing down here. I'm trying to have it automatically
       * redirect to the App.js file when we refresh the page. I was reading stuff about
       * needing to use webpack and index.html but I didn't really get it so will continue
       * to hardcode it to index.js
       */
       // // Serve the static files generated by the `npm run build` command
      app.use(express.static(path.join(__dirname, '..', '..', 'build')));

      // // Redirect to the homepage when the root URL is accessed
      // app.get('/', function (req, res) {
      //   res.redirect('/home');
      // });

      // // Serve the homepage
      // app.get('/home', function (req, res) {
      //   res.sendFile(path.join(__dirname, '..', '..', 'frontend-react-draft', 'build', 'index.html'));
      // });

       app.get('/', function (req, res) {
        //res.redirect(FRONTEND_URL);
        res.sendFile(path.join(__dirname, '..', '..', 'src', 'index.js'));
        //res.status(201).send("Return to home screen");
      });

   })
   .catch(error => console.error("Didn't connect to Mongo" + error));