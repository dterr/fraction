import * as mongodb from "mongodb";

// Payees included in bill: their name, the list of items they got, and the total they owe
export interface Payee {
  _name: String;
  _orders: Array<Number>; // Array of indices from _orders property in Bill
  _orderTotal: Number;
}

export interface Item {
  _desc: String;
  _qty: Number;
  // If qty > 1 _pricePerItem is relevant
  _pricePerItem: Number;
  _totalPrice: Number;
}

export interface Bill {
   _store: String,
   _total: Number,
   _cash: Number,
   _change: Number,
   _orders: Array<Item>;
   _tip: Number;
   _tax: Number;
   _subTotal: Number;
   _payees?: Array<Payee>;
   _id?: mongodb.ObjectId;
}
