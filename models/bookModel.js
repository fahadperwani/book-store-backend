import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, default: "Anonymous" },
  rating: { type: String, default: "-.-" },
  reviews: { type: String, default: "0" },
  price: { type: String, default: "$0.0" },
  desc: { type: String, required: true },
  img: { type: String, required: true },
});

export function getBookModel(name) {
  try {
    const Book = mongoose.model(name, bookSchema);
    return Book;
  } catch (error) {
    console.log(error);
  }
}
