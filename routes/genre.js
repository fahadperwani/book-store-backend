import express from "express";
import { getBookModel } from "../models/bookModel.js";

const router = express.Router();
router.get("/:name", async (req, res) => {
  // console.log(req.params.name);
  const Book = getBookModel(req.params.name);
  const books = await Book.find({}, {});
  res.send(books);
});

router.get("/:genre/:id", async (req, res) => {
  // console.log(req.params);
  const Book = getBookModel(req.params.genre);
  const book = await Book.findById(req.params.id);
  res.send(book);
});

export default router;
