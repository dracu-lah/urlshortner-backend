import mongoose from "mongoose";

export const shortnerSchema = new mongoose.Schema({
  url: { type: String, required: true },
  shortenedUrl: { type: String, required: true },
  clicks: [{ timeStamp: Date, userAgent: String }],
  email: { type: String, required: true },
  timeStamp: { type: Date, required: true },
});
export const ShortnerModel = mongoose.model("ShortnerModel", shortnerSchema);
