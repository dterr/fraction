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
    params: { region: 'us'},
    data : data
  };

  let token = await axios(config).then(function (response: any) {
    return response.data.token;
  }) .catch(function (error: any) {
    console.log(error);
  });

  await sleep(ms);

  // View TabScanner docs on results for more: https://docs.tabscanner.com/#documenter-4-2
  var config2 = {
    method: 'get',
    url: `https://api.tabscanner.com/api/result/${token}`,
    headers: {
     'apikey': TABSCANNER_API_KEY
    }
  };

  let receiptBody = await axios(config2).then(function (response: any) {
    return response.data.result;
  }) .catch(function (error: any) {
    console.log(error);
  });

  return receiptBody;
}

// View TabScanner docs on results for more: https://docs.tabscanner.com/#documenter-4-2
export function convertOCRToBill(receiptBody: any, tip: Number): Bill {
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
