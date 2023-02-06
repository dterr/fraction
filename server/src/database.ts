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

           // This is based on parsing from the OCR service
           
           // required: ["name", "position", "level"],
           // additionalProperties: false,
           // properties: {
           //     _id: {},
           //     name: {
           //         bsonType: "string",
           //         description: "'name' is required and is a string",
           //     },
           //     position: {
           //         bsonType: "string",
           //         description: "'position' is required and is a string",
           //         minLength: 5
           //     },
           //     level: {
           //         bsonType: "string",
           //         description: "'level' is required and is one of 'junior', 'mid', or 'senior'",
           //         enum: ["junior", "mid", "senior"],
           //     },
           // },
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
