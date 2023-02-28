const axios = require('axios');

const apiKey = TABSCANNER_API_KEY;
const endpoint = 'https://api.tabscanner.com/api/v2/process';

const processReceipt = async (filePath) => {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-API-KEY': apiKey,
    },
  };

  const response = await axios.post(endpoint, formData, config);
  const { items, total } = filterReceiptData(response.data);
  return { image: filePath, items, total };
};



module.exports = processReceipt;
