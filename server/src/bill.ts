import * as mongodb from "mongodb";

// Payees included in bill: their name, the list of items they got, and the total they owe
interface Payee {
  _name: String;
  _orders: Array<Number>; // Array of indices from _orders property in Bill
  _orderTotal: Number;
}

interface Item {
  _desc: String;
  _qty: Number;
  _price: Number;
}

export interface Bill {
   _orders: Array<Item>;
   _tip: Number;
   _tax: Number;
   _total: Number;
   _payees?: Array<Payee>;
   _id?: mongodb.ObjectId;
}
