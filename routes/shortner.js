import express from "express";
import { ShortnerModel } from "../models/shortner.js";
import { nanoid } from "nanoid";
const shortnerRouter = express.Router();

shortnerRouter.get("/", async (req, res) => {
  const { email } = req.params;
  const data = await ShortnerModel.find({ email }).exec();
  res.send({ message: "Fetched All URLs", data });
});

shortnerRouter.post("/", async (req, res) => {
  const { email, url } = req.body;
  const shortenedUrl = nanoid(10);
  const postValue = new ShortnerModel({
    url,
    shortenedUrl,
    email,
  });
  const data = await postValue.save();
  res.send({ message: "Added URL Successfully", data });
});

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
      { clicks: [{ timeStamp: Date.now(), userAgent }] },
    );

    res.redirect(data.url);
  } else {
    res.status(500).send({ message: "Something Went Wrong" });
  }
});

export default shortnerRouter;
