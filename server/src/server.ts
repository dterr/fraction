import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { billRouter } from "./bill.routes";
import { connectToDatabase } from "./database";

import { getOCR, convertOCRToBill } from "./helpers";
import multer from 'multer';

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
   console.error("No ATLAS_URI environment variable has been defined in config.env");
   process.exit(1);
}

connectToDatabase(ATLAS_URI)
   .then(() => {
       const app = express();
       app.use(cors());

       app.use("/bills", billRouter);

       let port = parseInt("3000");
       if (port == null || String(port) == "") {
         port = 5200;
       }

       var path = require('path')

       var storage = multer.diskStorage({
       destination: function (req, file, cb) {
          cb(null, 'uploads/')
       },
       filename: function (req, file, cb) {
          cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
       }
       });

      var upload = multer({ storage: storage });

       app.post('/api/receipt', upload.single('file'), async (req: express.Request, res: express.Response) => {
         try {
            //const { filePath, tip, phoneNumber } = req.body;
            console.log("Request", req);
            const file = req.file;
            const tip = req.body.tip;
            const filePath = file ? file.path : "server/src/upload/test.png";
            console.log("Filepath!", filePath);

            let bill;
        
            // Send receipt for OCR and get text body of receipt
            const receiptBody = getOCR(3000, filePath).then();
            console.log(receiptBody);
            getOCR(3000, filePath).then( (receiptBody) => {
               console.log("\n\n\n", receiptBody);
               bill = convertOCRToBill(receiptBody, tip);
            });
            
            // Return response with success message
            res.status(200).json({ message: "Receipt processed successfully!" });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error processing receipt" });
          }
        });

       // start the Express server
       app.listen(port, () => {
           console.log(`Server running at http://localhost:${port}...`);
       });

       app.get('/', function (req, res) {
        // res.render('index', {});
        res.status(201).send("Hello");
      });

   })
   .catch(error => console.error(error));
