import * as mongodb from "mongodb";

export interface Bill {
   generatedLink: string;
   // ADD more properties of bill here
   // such as all orders
   // order amounts
   // tax/tip
   _id?: mongodb.ObjectId;
}
