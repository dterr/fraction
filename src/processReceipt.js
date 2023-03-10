const axios = require('axios');
//const { receiveMessageOnPort } = require('worker_threads');

const apiKey = process.env.TABSCANNER_API_KEY;
const endpoint = 'https://api.tabscanner.com/api/v2/process';

var Receipt = require("./schema/receipt")

async function processReceipt(req) {
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

  //export default processReceipt;