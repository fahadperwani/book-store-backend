import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema({
  link: { type: String, required: true },
});

export const getLinkModel = (name) => {
  try {
    if (mongoose.models[name]) return mongoose.model(name);
    return mongoose.model(name, LinkSchema);
  } catch (error) {
    console.log(error);
  }
};
