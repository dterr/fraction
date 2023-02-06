import * as mongodb from "mongodb";

export interface Bill {
   // such as all orders
   // order amounts
   // tax/tip
   _id?: mongodb.ObjectId;
}
