import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import shortnerRouter from "./routes/shortner.js";
import bodyParser from "body-parser";
const app = express();
const port = process.env.NODE_ENV_PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome To Shortly Backend!");
});
app.use("/api/shortner", shortnerRouter);
mongoDbConnection().catch((err) => console.log(err));

async function mongoDbConnection() {
  await mongoose.connect(process.env.NODE_ENV_MONGO_URI || "");
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
