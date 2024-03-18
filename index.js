import express from "express";
import genre from "./routes/genre.js";
import payment from "./payment/payment.cjs";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to the database........."))
  .catch((err) => {
    console.log(err);
  });
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.use("/genre", genre);
app.use("/stripe/payment", payment);

app.listen(port, console.log("listening to port: " + port));
