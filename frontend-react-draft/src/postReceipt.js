const Receipt = require('./models/Receipt');

const storeReceipt = async (receiptData) => {
  const { image, items, total } = receiptData;
  const receipt = new Receipt({ image, items, total });
  const savedReceipt = await receipt.save();
  return savedReceipt;
};

module.exports = storeReceipt;