import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import shortnerRouter from "./routes/shortner.js";
import bodyParser from "body-parser";
import { ShortnerModel } from "./models/shortner.js";
const app = express();
const port = process.env.NODE_ENV_PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "https://urlshortner-next.vercel.app",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  }),
);

app.get("/", (req, res) => {
  res.send("Welcome To Shortly Backend!");
});

app.get("/:shortenedUrl", async (req, res) => {
  const { shortenedUrl } = req.params;
  const userAgent = req.headers["user-agent"];
  const data = await ShortnerModel.findOne(
    {
      shortenedUrl,
    },
    "url",
  ).exec();

  if (data) {
    await ShortnerModel.updateOne(
      { shortenedUrl },
      { $push: { clicks: { timeStamp: Date.now(), userAgent } } },
    );

    res.redirect(data.url);
  } else {
    res.status(404).send({ message: "Shortned Link Not Found" });
  }
});

app.use("/api/shortner", shortnerRouter);

mongoDbConnection().catch((err) => console.log(err));

async function mongoDbConnection() {
  await mongoose.connect(process.env.NODE_ENV_MONGO_URI || "");
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
