import * as dotenv from "dotenv";
import { Item, Bill } from "./bill";

const fs = require("fs");
const FormData = require('form-data');
const axios = require('axios');

// HEIC conversion imports
import { promisify } from 'util';
//import fs from 'fs';
import convert from 'heic-convert';
var path = require('path')

dotenv.config();

// Load ENV API_KEYS from twilio and tabscanner
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

  /*
    Sends POST request to tabscanner server to submit an image.
    Returns a token in response to then query for receipt results
    once fully processed.

    View TabScanner docs on processing for more: https://docs.tabscanner.com/#documenter-4-1
  */
  var config = {
    method: 'post',
    url: 'https://api.tabscanner.com/api/2/process',
    headers: {
     'apikey': TABSCANNER_API_KEY
    },
    params: { region: 'us', documentType: 'receipt', defaultDateParsing: 'm/d', cents: false},
    data : data
  };

  let token = await axios(config).then(function (response: any) {
    return response.data.token;
  }).catch(function (error: any) {
    console.log(error);
  });

  /*
    Sends GET request to tabscanner server to retrieve receipt results
    by token id from POST response. We constantly ping the server
    unti the response is a successful process.

    View TabScanner docs on processing for more: https://docs.tabscanner.com/#documenter-4-2
  */

  var config2 = {
    method: 'get',
    url: `https://api.tabscanner.com/api/result/${token}`,
    headers: {
     'apikey': TABSCANNER_API_KEY
    }
  };

  let ocrCode = 0
  let receiptBody = {}

  
  while(ocrCode != 202) {
    let receipt = await axios(config2).then(function (response: any) {
      return response.data;
    }) .catch(function (error: any) {
      console.log(error);
    });
    // We can also grab receipt.success for error checking
    receiptBody = receipt.result
    ocrCode = receipt.code
  }
  return receiptBody;
}

/*
  Processes receipt JSON from TabScanners into correct format for MongoDB.
  Namely, we create a Bill object with the:
    - store
    - bill total
    - cash
    - change to be given
    - tax
    - tip
    - subtotal
    - all orders which is an array of Items

  Items have the description, quanitity, price per
  item (with a transform), and total price of item

  View TabScanner docs on processing for more: https://docs.tabscanner.com/#documenter-4-2
*/
export function convertOCRToBill(receiptBody: any, tip: Number): Bill {
  console.log("%cThis is what the OCR returns: ", "color:red;font-size:50;");
  console.log("%O", receiptBody);

  let items: Array<Item> = [];

  receiptBody.lineItems.forEach( (currItem: any) => {
      items.push({
        _desc: currItem.descClean,
        _qty: currItem.qty === 0 ? 1 : currItem.qty,
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

/*
  Sends SMS with link to specific recipient.
  TWILIO has approved us with a TOLL-FREE Number
  to use for texting phone numbers to improve
  payee user flow
*/
export async function sendSMS(phoneNumber: String, link: String) {
  await twilio_client.messages
   .create({
     body: link,
     to: `+1${phoneNumber}`, // Text this number like +12345678901
     from: TWILIO_NUMBER, // From a valid Twilio number
   })
   .then((message: any) => console.log(message.sid));
}

/*
  Takes in a HEIC Image and converts it to JPG
*/
export async function convertHEIC(filePath: String) {
  // Read the HEIC file
  const inputBuffer = await promisify(fs.readFile)(filePath);

  // Convert the HEIC file to JPEG
  const outputBuffer = await convert({
    buffer: inputBuffer, // the HEIC file buffer
    format: 'JPEG',      // output format
    quality: 1           // the jpeg compression quality, between 0 and 1
  });

  // Replace the original file with the converted JPEG file
  filePath = filePath.replace(path.extname(filePath), '.jpg');
  await promisify(fs.writeFile)(filePath, outputBuffer);
  return filePath;
}

export function mergeDuplicateLineItems(items: Item[]): Item[] {
  const mergedItems: Item[] = [];

  items.forEach((item) => {
    const existingItem = mergedItems.find((mergedItem) => mergedItem._desc === item._desc && mergedItem._pricePerItem === item._pricePerItem);

    if (existingItem) {
      existingItem._qty = Number(existingItem._qty) + Number(item._qty);
      existingItem._totalPrice = Number(existingItem._totalPrice) + Number(item._totalPrice);
    } else {
      mergedItems.push(item);
    }
  });

  return mergedItems;
}