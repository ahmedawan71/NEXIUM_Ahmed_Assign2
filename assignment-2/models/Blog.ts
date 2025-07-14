import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  url: { type: String, required: true },
  fullText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
export const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
