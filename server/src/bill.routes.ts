import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";

export const billRouter = express.Router();
billRouter.use(express.json());

billRouter.get("/", async (_req, res) => {
   try {
       const bills = await collections.bills.find({}).toArray();
       res.status(200).send(bills);
   } catch (error) {
       res.status(500).send(error.message);
   }
});

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
       const bill = req.body;
       const result = await collections.bills.insertOne(bill);

       if (result.acknowledged) {
           res.status(201).send(`Created a new bill: ID ${result.insertedId}.`);
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
