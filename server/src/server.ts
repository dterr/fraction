import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { billRouter } from "./bill.routes";
import { connectToDatabase } from "./database";

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

       let port = parseInt(process.env.PORT);
       if (Number.isNaN(port) || String(port) == "") {
         port = 5200;
       }

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
