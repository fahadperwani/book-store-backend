import { links, types } from "../modelsConfig.js";
import { getLinkModel } from "../models/linkModel.js";
import { scrapper } from "./linkScrapper.js";
import { scrapper as bookScrapper } from "./bookScrapper.js";
import { getBookModel } from "../models/bookModel.js";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URL).then(async () => {
  console.log("DataBase Connected");
  for (let i = 0; i < types.length; i++) {
    const Link = getLinkModel(types[i] + "link");
    const result = await scrapper(links[i], Link);
    if (!result || result.length == 0) i--;
  }
  for (let idx = 7; idx < types.length; idx++) {
    const Book = getBookModel(types[idx]);
    await bookScrapper(Book, types[idx] + "links");
  }
});
