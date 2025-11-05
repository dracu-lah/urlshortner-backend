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

  if (data) {
    res.send({ message: "Fetched All URLs", data });
  }

  res.send({ message: "Fetched All URLs", data: [] });
});

// Create A Shortned Url
shortnerRouter.post("/", async (req, res) => {
  const { email, url, customShortenedUrl } = req.body;
  const [currentDateString] = new Date().toLocaleString().split(",");
  const todaysCount = await ShortnerModel.find({
    email: email,
    timeStamp: { $gte: new Date(currentDateString) },
  })
    .countDocuments()
    .exec();

  if (todaysCount > 4) {
    res
      .status(429)
      .send({ message: "Limit Reached For Today, Try Again Next Day!" });
  } else {
    const customShortenedUrlExists = await ShortnerModel.findOne({
      shortenedUrl: customShortenedUrl,
    }).exec();

    if (customShortenedUrlExists) {
      res.status(409).send({ message: "This Link Exists Already" });
    }

    const shortenedUrl =
      customShortenedUrl || (await generateFunction(nanoid(6)));

    const postValue = new ShortnerModel({
      url,
      shortenedUrl,
      email,
      timeStamp: Date.now(),
    });

    const data = await postValue.save();

    res.send({ message: "Added URL Successfully", data });
  }
});

// Delete
shortnerRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (id) {
    await ShortnerModel.deleteOne({ _id: id });
    res.send({ message: "Deleted The Shortened Url" });
  }
  res.status(500).send({ message: "Deletion Failed" });
});

async function generateFunction(value) {
  const customShortenedUrlExists = await ShortnerModel.findOne({
    shortenedUrl: value,
  }).exec();
  if (customShortenedUrlExists) {
    return generateFunction(value);
  }
  return value;
}
export default shortnerRouter;
