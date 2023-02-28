const express = require('express');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
// const helpers = require('frontend-react-draft/server/src/helpers.ts');
// const { convertOCRToBill } = require('../server/src/helpers.ts');
// const processReceipt = require('./processReceipt.js');
// const storeReceipt = require('./storeReceipt');

const app = express();
const port = 3000;

app.use(express.static('public'));

/* HELPER FUNCTIONS */

const processReceipt = async (req) => {
    //   const picture = req.uploadedphoto;
    //   const formData = new FormData();
    //   formData.append('file', fs.createReadStream(filePath));
    
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-API-KEY': apiKey,
        },
      };
      console.log(req.uploadedphoto);
      const response = await axios.post(endpoint, req, config);
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

app.post('/api/receipt', upload.single('receipt'), async (req, res) => {
  try {
    console.log("Going to try getOCR", req);
    
    // const receiptBody = await helpers.getOCR(10000, req.uploadedphoto);
    // const bill = convertOCRToBill(receiptBody, 0);
    // await storeReceipt(bill);
    res.status(200).send('Receipt processed and stored successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});
// var server = app.listen(port, function () {
//     var port = server.address().port;
//     console.log(path.join('Listening at http://localhost:', String(port) , ' exporting the directory ' , String(__dirname)));
// });
app.listen(port, () => console.log(`Server listening on port ${port}`));