const helpers = require('./helpers');
const Bill = require('./bill').Bill;

const processReceipt = async (filePath) => {
  const receiptBody = await helpers.getOCR(5000, filePath);
  const bill = helpers.convertOCRToBill(receiptBody, 0);
  return new Bill(bill);
};

module.exports = processReceipt;