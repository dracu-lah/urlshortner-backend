import express from "express";
import { ShortnerModel } from "../models/shortner.js";
import { nanoid } from "nanoid";
const shortnerRouter = express.Router();

// Get All URLS
shortnerRouter.get("/", async (req, res) => {
  const { email } = req.query;
  const data = await ShortnerModel.find({
    email: email,
  }).exec();

  res.send({ message: "Fetched All URLs", data });
});

// Create A Shortned Url
shortnerRouter.post("/", async (req, res) => {
  const { email, url, customShortenedUrl } = req.body;

  const customShortenedUrlExists = await ShortnerModel.findOne({
    shortenedUrl: customShortenedUrl,
  }).exec();
  console.log(customShortenedUrlExists);

  if (customShortenedUrlExists) {
    res.status(409).send({ message: "This Link Exists Already" });
  }

  const shortenedUrl = customShortenedUrl || nanoid(10);

  const postValue = new ShortnerModel({
    url,
    shortenedUrl,
    email,
    timeStamp: Date.now(),
  });

  const data = await postValue.save();

  res.send({ message: "Added URL Successfully", data });
});

// Get the Shortned Url
shortnerRouter.get("/:shortenedUrl", async (req, res) => {
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

export default shortnerRouter;
