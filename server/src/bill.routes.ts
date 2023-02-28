import * as express from "express";
import * as mongodb from "mongodb";

import {getOCR, sendSMS, convertOCRToBill} from "./helpers";
import { collections } from "./database";
import { Bill, Item, Payee } from "./bill";
import { UploadedFile } from "express-fileupload";

const fileUpload = require('express-fileupload');

export const billRouter = express.Router();

billRouter.use(express.json());
billRouter.use(fileUpload({
        limits: {
            fileSize: 10000000, // Around 10MB
        },
        abortOnLimit: true,
    }));

billRouter.post("/", async (req, res) => {
   try {
       // Get the file that was set to our field named "image"
       const image = req.files.image as UploadedFile
       const { tip } = req.body;

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
       const bill = convertOCRToBill(receiptBody, tip);

       const result = await collections.bills.insertOne(bill);

       if (result.acknowledged) {
           res.status(201).send(`Created a new bill: ID ${result.insertedId}. Share this link with your friends: https://fifteen.herokuapp.com/bills/${result.insertedId}`);
       } else {
           res.status(500).send("Failed to create a new bill.");
       }
   } catch (error) {
       console.error(error);
       res.status(400).send(error.message);
   }
});

billRouter.get("/:id", async (req, res) => {
   try {
       const id = req?.params?.id;
       const query = { _id: new mongodb.ObjectId(String(id)) };
       const bill: Bill = await collections.bills.findOne(query);

       const payees = bill._payees;

       const payeeOrders = payees.map(function(payee, index){
         return (payee as Payee)._orders.map(i => (bill._orders[(i as number)] as Item)._desc)
       });

       const taxAndTip: number = +bill._tax + +bill._tip;
       const owedAmounts = payees.map(function(payee, index){
         let taxAndTipPortion = (payee._orderTotal as number) * taxAndTip / (bill._subTotal as number)
         return parseInt((+payee._orderTotal + +taxAndTipPortion).toFixed(2));
       });

       if (bill) {
           // Show all payees here
           res.status(200).send({"orders": bill._orders, "payees": payees, "payeeOrders": payeeOrders, "owedAmounts": owedAmounts});
       } else {
           res.status(404).send(`Failed to find a bill: ID ${id}`);
       }

   } catch (error) {
       res.status(404).send(`Failed to find a bill: ID ${req?.params?.id}`);
   }
});

billRouter.put("/:id", async (req, res) => {
   try {

       const id = req?.params?.id;
       const query = { _id: new mongodb.ObjectId(String(id)) };
       const bill: Bill = await collections.bills.findOne(query);

       let orderTotal: number = 0

       req.body.orders.forEach(function(i,){
         orderTotal += ((bill._orders[i] as Item)._pricePerItem as number)
       });

       // Get name
       // Get orders and map to index
       // Get orders total from indices
       const payee: Payee = {
         _name:req.body.name,
         _orders: req.body.orders,
         _orderTotal: orderTotal
       }

       const result = await collections.bills.updateOne(query, { $push: { "_payees": payee } });

       if (result && result.matchedCount) {
           res.status(200).send(`Updated a bills payee: ID ${id}.`);
       } else if (!result.matchedCount) {
           res.status(404).send(`Failed to find a bill: ID ${id}`);
       } else {
           res.status(304).send(`Failed to update a bill payee: ID ${id}`);
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
