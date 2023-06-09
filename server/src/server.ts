//@ts-nocheck
import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { billRouter } from "./bill.routes";
import ReceiptModel, { default as Receipt } from "./receipt";
import { Bill, Item } from "./bill"
import { getOCR, convertOCRToBill, convertHEIC, mergeDuplicateLineItems } from "./helpers";
import multer from 'multer';

let path = require('path')

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
   console.error("No ATLAS_URI environment variable has been defined in config.env");
   process.exit(1);
}

let mongoose = require('mongoose');

mongoose.connect(ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => {
       const app = express();

       app.use(cors());

       // Use bill.routes.ts for all /bills routes
       app.use("/bills", billRouter);

       // Be able to parse incoming and outgoing json
       app.use(express.json());

       // Use port
       let port = parseInt("3000");

       // Multer is a node.js middleware for handling multipart/form-data,
       // which is primarily used for uploading files. It is written on top
       // of busboy for maximum efficiency.
        const storage = multer.diskStorage({
         dest: function (req, file, cb) {
            cb(null, 'uploads/')
         },
         filename: function (req, file, cb) {
            cb(null, file.originalname)
         }
         })
         const upload = multer({storage: storage})

       // /api/receipt POST for uploading file and providing tip amount
       app.post('/api/receipt', upload.single('file'), async (req: express.Request, res: express.Response) => {
         try {

            const file = req.file;
            const tip = req.body.tip; //TODO GET TIP
            let filePath = file ? file.path : "server/src/upload/test.png";

            /* Check if file is HEIC and if so, convert to JPG */
            if (file && path.extname(file.originalname).toLowerCase() === '.heic') {
              filePath = await convertHEIC(filePath);
            }

            if (req.body.test) {
              console.log("Test run detected, skipping OCR . . .", req.body.test);
              const testReceipt = new ReceiptModel({
                isClosed: false,
                creatorName: "Dominic",
                establishment: "Yaga",
                total: 120,
                subtotal: 114.3,
                cash: 0,
                change: 0,
                tax: 5,
                tip: .7,
                currency: "USD",
                lineItems: [],
              })
              res.status(200).json({ message: `Receipt processed without OCR`, receipt: testReceipt});
            } else  {

            // Send receipt for OCR and get text body of receipt
            const receiptBody = await getOCR(30000, filePath);
            const bill = convertOCRToBill(receiptBody, tip);
            // Catch any duplicate line items
            const cleanedItems = mergeDuplicateLineItems(bill._orders);

            // Save receipt to database
            const newReceipt = new ReceiptModel({
                  numUsers: 0,
                  isClosed: false,
                  creatorVenmo: req.body.venmo,
                  creatorName: req.body.name,
                  establishment: bill._store,
                  total: bill._total,
                  subtotal: bill._subTotal,
                  cash: bill._cash,
                  change: bill._change,
                  tax: bill._tax,
                  tip: bill._tip,
                  currency: "USD",
                  lineItems: cleanedItems.map((item: Item) => ({
                     lineTotal: item._totalPrice,
                     desc: item._desc,
                     qty: item._qty,
                     price: item._pricePerItem,
                     unit: "item",
                     payers: bill._payees ? bill._payees.map((payee) => payee._name) : [],
                     })),
               });

            res.status(200).json({ message: `OCR results received!`, receipt: newReceipt });
            }
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error processing receipt" });
          }
        });

      app.post('/api/approved-receipt', async (req: express.Request, res: express.Response) => {
        try {
          const approvedReceipt = new ReceiptModel(req.body.approved_receipt);
          const result = await approvedReceipt.save();
          console.log("Successfully saved with id %O. Here is the receipt: %O", result.id, approvedReceipt);
          // Return response with success message
          res.status(200).json({ message: `Receipt processed successfully!`, link: `https://fifteen.herokuapp.com/selections/${result.id}`});
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Error saving approved receipt" });
        }
        
    });

      // Queries database for a receipt of a given name
      // It queries for the user who presses the submit button
      // Request.body has receiptID and map of string to boolean
      app.post('/receipt/claimItems/', function(request, response) {
        const json = request.body;
         console.log("Received request for claim items " + JSON.stringify(json));
         ReceiptModel.findOne({_id: new mongoose.Types.ObjectId(json.receiptID)})
           .select("creatorVenmo creatorName lineItems")
           .then(function (receipt) {
             if (!receipt) {
               console.log("Could not find receipt with id: " + json.receiptID);
               response.status(400).send("Could not find receipt with id: " + json.receiptID);
               return;
             }
             // Checks all users
             for (let i = 0; i < json.items.length; i++) {
              if (json.items[i].isChecked) {
                for(let j = 0; j < receipt.lineItems.length; j++) {
                  if (receipt.lineItems[j].desc === json.items[i].desc && !receipt.lineItems[j].payers.includes(json.user))
                    receipt.lineItems[j].payers.push(json.user);
                }
              } else {
                for(let j = 0; j < receipt.lineItems.length; j++) {
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

      // adds number of users for a given receipt to the database
      app.post('/receipt/countUsers/', function(request, response) {
        const json = request.body;
        console.log("Received request for receipt " + JSON.stringify(json));
        ReceiptModel.findOne({_id: new mongoose.Types.ObjectId(json.receiptID)})
          .select("numUsers")
          .then(function (receipt) {
            if (!receipt) {
              console.log("Could not find receipt with id: " + json.receiptID);
              response.status(400).send('Receipt not found');
              return;
            }
              receipt.numUsers = json.numUsers
              receipt.save();
              response.status(200).send(receipt);
            })
          .catch(function (err: Error) {
            console.log(err);
            response.status(500).send('Error occurred while processing the request');
          });
       });
      
       // /receipt/status/:json POST for closing a tab (changes the status of receipt.isClosed)
      app.post('/receipt/status/:json', function(request, response) {
        let json = JSON.parse(request.params.json);
        console.log("Changing status of " + JSON.stringify(json));
        ReceiptModel.findOne({_id: new mongoose.Types.ObjectId(json.receiptID)})
          .select("isClosed")
          .then(function (receipt) {
            if (!receipt) {
              console.log("Could not find receipt with id: " + json.receiptID);
              response.status(400).send('Receipt not found');
              return;
            }
            receipt.isClosed = json.isClosed
            receipt.save();
            response.status(200).send(receipt);
          })
          .catch(function (err: Error) {
            console.log(err);
            response.status(500).send('Error occurred while processing the request');
          });
      });

       // /receipt/listItems/:json GET for finding specific items from receipt
       app.get('/receipt/listItems/:json', function(request, response) {
         var json = JSON.parse(request.params.json);
         var id = json.receiptID;
         var username = json.user;
         if (id === "" || !request.params.json) {
           response.status(401).send("List items request was not given a receipt ID");
           return;
         }

         Receipt.findOne({_id: new mongoose.Types.ObjectId(id)}).select("_id numUsers isClosed creatorVenmo creatorName establishment total subtotal tax tip lineItems").then(function (receipt) {
            if (!receipt) {
               console.log("Could not find receipt with id: " + request.body.receiptID);
               response.status(400).send('Receipt not found');
               return;
            } else {
             let lineItemsList = new Array();
             for (let item of receipt.lineItems) {
              lineItemsList.push({desc: item.desc, isChecked: item.payers.includes(username), payers: item.payers, qty:item.qty, price:item.price, lineTotal:item.lineTotal,});
             }
             response.status(200).send({lineItems: lineItemsList, numUsers: receipt.numUsers, isClosed: receipt.isClosed, creatorVenmo: receipt.creatorVenmo, creatorName: receipt.creatorName, establishment: receipt.establishment, total: receipt.total, subtotal: receipt.subtotal, tax: receipt.tax, tip: receipt.tip});
           }
         });
      });

       // Serve the static files generated by the `npm run build` command
       app.use(express.static(path.join(__dirname, '..', '..', 'build')));

       // Use all of the built files
       app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'build', 'index.html'));
      });
      

       // start the Express server
       app.listen((process.env.PORT || port), () => {
           console.log(`Server running at http://localhost:${port}...`);
       });

   })
   .catch(error => console.error("Didn't connect to Mongo" + error));
