var mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true, useUnifiedTopology: true });
var Receipt = require('./schema/receipt.js');

(function() {
  Receipt.find({creatorName: "Paul"}).select("establishment").then(function (err, receipt) {
    if (err) console.log(err);
    else console.log(JSON.stringify(receipt));
  });
})();