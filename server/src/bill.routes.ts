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
           res.status(404).send(`Failed to find an bill: ID ${id}`);
       }

   } catch (error) {
       res.status(404).send(`Failed to find an bill: ID ${req?.params?.id}`);
   }
});
