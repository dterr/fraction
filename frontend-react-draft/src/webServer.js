const express = require('express');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const axios = require('axios');
const cors = require('cors');
// const helpers = require('frontend-react-draft/server/src/helpers.ts');
// const { convertOCRToBill } = require('../server/src/helpers.ts');
// const processReceipt = require('./processReceipt.js');
// const storeReceipt = require('./storeReceipt');

const app = express();
const port = 3001;
var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://chuddy:kuklinevalashki@cs194.2dvr2.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
var Receipt = require('./schema/receipt.js');

app.use(cors());
app.use(express.static('public'));

/* HELPER FUNCTIONS */

const processReceipt = async (req) => {
    //   const picture = req.uploadedphoto;
    //   const formData = new FormData();
    //   formData.append('file', fs.createReadStream(filePath));
    const apiKey = "hardcoded";
    console.log("Inside processReceipt: \n");    
      const config = {
        headers: {
          'Content-Type': `multipart/form-data`,
          'apikey': apiKey,
          'timeout': 30000,
        },
      };
      const endpoint = 'https://api.tabscanner.com/api/v2/process';
      const response = await axios.post(endpoint, req, config);
      console.log("Axios Response from API:", response);
      const filteredData = filterReceiptData(response.data);
      const newReceipt = new Receipt(filteredData);
      await newReceipt.save();
      console.log("Receipt saved to database:", newReceipt);
      return newReceipt;
    };
    
    const filterReceiptData = (data) => {
        const filteredData = {
          establishment: data.establishment,
          total: data.total,
          subtotal: data.subtotal,
          cash: data.cash,
          change: data.change,
          tax: data.tax,
          tip: data.tip,
          currency: data.currency,
          lineItems: []
        };
      
        for (const lineItem of data.lineItems) {
          const { lineTotal, desc, qty, price, unit } = lineItem;
          filteredData.lineItems.push({ lineTotal, desc, qty, price, unit });
        }
      
        return filteredData;
      };

/* EXPRESS METHODS */

app.post('/api/receipt', upload.single('file'), function (req, res) {
  try {
    console.log("Going to try getOCR", req.file);
    const filteredData = processReceipt(req);
    
    // const receiptBody = await helpers.getOCR(10000, req.uploadedphoto);
    // const bill = convertOCRToBill(receiptBody, 0);
    // await storeReceipt(bill);
    res.status(200).send('Receipt processed and stored successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

//Get receipt's index in mongo to generate unique link
app.get('receipt/uniqueLink', function(request, response) {

});

//Get user name from request.body
app.post('/receipt/claimItems', function(request, response) {
  console.log("Received request" + JSON.stringify(request.body));
  Receipt.find({creatorName: request.body.receiptID}).select("creatorName lineItems").then(function (err, receipt) {
    if (err || receipt.length === 0) {
      console.log("Could not find receipt with id: " + request.body.receiptID);
      response.status(400).send('Receipt not found');
      return;
    }
    for (var i = 0; i < receipt.lineItems.length; i++) {
      if (request.body.items[receipt.lineItems[i].desc]) {
        receipt.lineItems[i].payers.push(request.body.user);
      }
    }
    receipt.save();
    response.status(200).send(receipt);
  });
});

app.get('/receipt/listItems/:receiptID', function(request, response) {
  var id = request.params.receiptID;
  if (id === "" || !request.params.receiptID) {
    response.status(401).send("List items request was not given a receipt ID");
    return;
  }
  Receipt.find({_id: id}).select("_id lineItems").then(function (err, receipt) {
    if (err) console.log(err);
    else {
      console.log(JSON.stringify(receipt));
      response.status(200).send(receipt);
    }
  });
  //console.log("Received request to list items " + JSON.stringify(request));
  //test_items = {"items": {"name": "hamburger", "isChecked": true}};
  //return response.status(400).send(JSON.stringify(test_items));
});

// var server = app.listen(port, function () {
//     var port = server.address().port;
//     console.log(path.join('Listening at http://localhost:', String(port) , ' exporting the directory ' , String(__dirname)));
// });
app.listen(port, () => console.log(`Server listening on port ${port}`));