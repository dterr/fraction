var mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true, useUnifiedTopology: true });
var Receipt = require('./schema/receipt.js');


(function() {
  var foods = [{lineTotal: 15, desc: "Tacos", qty: 3, price: 5, unit: "taco", payers:[]},
            {lineTotal: 24, desc: "Burritos", qty: 2, price: 12, unit: "burrito", payers:[]},
            {lineTotal: 6, desc: "Horchata", qty: 1, price: 6, unit: "cup", payers:[]}];
  var test_bill = {creatorName: "Paul", establishment:"Chilis", total: 45, subtotal: 45, cash: 0, change: 0, tax: 0, tip: 0, currency: "USD", lineItems: foods};

  return Receipt.create({
    creatorName: test_bill.creatorName,
    establishment: test_bill.establishment,
    total: test_bill.total,
    subtotal: test_bill.subtotal,
    cash: test_bill.cash,
    change: test_bill.change,
    tax: test_bill.tax,
    tip: test_bill.tip,
    currency: test_bill.currency,
    lineItems: test_bill.lineItems
  }).then(function (userObj) {
    userObj.save();
    console.log('Test bill');
  }).catch(function(err) {
    console.error('Error create bill', err);
  });
})();