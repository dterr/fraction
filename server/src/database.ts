import * as mongodb from "mongodb";
import { Bill } from "./bill";

export const collections: {
   bills?: mongodb.Collection<Bill>;
} = {};

export async function connectToDatabase(uri: string) {
   const client = new mongodb.MongoClient(uri);
   await client.connect();

   const db = client.db("mean");
   await applySchemaValidation(db);

   const billsCollection = db.collection<Bill>("bills");
   collections.bills = billsCollection;
}

// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Bill model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db: mongodb.Db) {
   const jsonSchema = {
       $jsonSchema: {
           bsonType: "object",

           required: ["_orders", "_tip", "_tax", "_total"],
           additionalProperties: true,
           properties: {
               _id: {},
               _orders: {
                   bsonType: "Array<Item>",
                   description: "'_orders' is required and is a Array<Item>",
               },
               _tip: {
                   bsonType: "Number",
                   description: "'_tip' is required and is a Number",
               },
               _tax: {
                   bsonType: "Number",
                   description: "'_tax' is required and is a Number",
               },
               _total: {
                   bsonType: "Number",
                   description: "'_total' is required and is a Number",
               },
           },
       },
   };

   // Try applying the modification to the collection, if the collection doesn't exist, create it
  await db.command({
       collMod: "bills",
       validator: jsonSchema
   }).catch(async (error: mongodb.MongoServerError) => {
       if (error.codeName === 'NamespaceNotFound') {
           await db.createCollection("bills", {validator: jsonSchema});
       }
   });
}
