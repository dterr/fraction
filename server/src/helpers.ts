import * as dotenv from "dotenv";
import { Item, Bill } from "./bill";

const fs = require("fs");
const FormData = require('form-data');
const axios = require('axios');

dotenv.config();

const { TWILIO_SID_MAIN, TWILIO_TOKEN_MAIN, TWILIO_NUMBER, TABSCANNER_API_KEY } = process.env;
const twilio_client = require('twilio')(TWILIO_SID_MAIN, TWILIO_TOKEN_MAIN);

function sleep(ms: any) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


// OCR RESPONSE CODES
// 200 - Process request submitted successfully
// 202 - Result available
// 300 - Image uploaded, but did not meet the recommended dimension of 720x1280 (WxH)
// 301 - Result not yet available
// 400 - API key not found
// 401 - Not enough credit
// 402 - Token not found
// 403 - No file detected
// 404 - Multiple files detected, can only upload 1 file per API call
// 405 - Unsupported mimetype
// 406 - Form parser error
// 407 - Unsupported file extension
// 408 - File system error
// 500 - OCR Failure
// 510 - Server error
// 520 - Database Connection Error
// 521 - Database Query Error

// Sends receipt for OCR and returns text body of receipt
export async function getOCR(ms: Number, filePath: String): Promise<any> {
  var data = new FormData();
  //ex: server/src/upload/test.png
  data.append('file', fs.createReadStream(filePath));

  // View TabScanner docs on processing for more: https://docs.tabscanner.com/#documenter-4-1
  var config = {
    method: 'post',
    url: 'https://api.tabscanner.com/api/2/process',
    headers: {
     'apikey': TABSCANNER_API_KEY
    },
    params: { region: 'us', documentType: 'receipt', },
    data : data
  };

  let token = await axios(config).then(function (response: any) {
    return response.data.token;
  }).catch(function (error: any) {
    console.log(error);
  });

  // View TabScanner docs on results for more: https://docs.tabscanner.com/#documenter-4-2
  var config2 = {
    method: 'get',
    url: `https://api.tabscanner.com/api/result/${token}`,
    headers: {
     'apikey': TABSCANNER_API_KEY
    }
  };

  let isSuccessful = false
  let receiptBody = {}

  while(!isSuccessful){
    let receipt = await axios(config2).then(function (response: any) {
      return response.data;
    }) .catch(function (error: any) {
      console.log(error);
    });

    receiptBody = receipt.result
    isSuccessful = receipt.success
  }

  return receiptBody;
}

// View TabScanner docs on results for more: https://docs.tabscanner.com/#documenter-4-2
export function convertOCRToBill(receiptBody: any, tip: Number): Bill {
  console.log("%cThis is what the OCR returns: ", "color:red;font-size:50;");
  console.log("%O", receiptBody);

  let items: Array<Item> = [];

  receiptBody.lineItems.forEach( (currItem: any) => {
      items.push({
        _desc: currItem.descClean,
        _qty: currItem.qty,
        _pricePerItem: (currItem.lineTotal as number) / (currItem.qty as number),
        _totalPrice: currItem.lineTotal
      } as Item)
    })

  let bill: Bill = {
    _store: receiptBody.establishment,
    _total: receiptBody.total,
    _cash: receiptBody.cash,
    _change: receiptBody.change,
    _orders: items,
    _tip: tip,
    _tax: receiptBody.tax,
    _subTotal: receiptBody.subTotal
  }

  return bill
}

// Sends SMS with link to specific receipt
export async function sendSMS(phoneNumber: String, link: String) {
  await twilio_client.messages
   .create({
     body: link,
     to: `+1${phoneNumber}`, // Text this number like +12345678901
     from: TWILIO_NUMBER, // From a valid Twilio number
   })
   .then((message: any) => console.log(message.sid));
}
