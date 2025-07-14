import mongoose from "mongoose";

const textSchema = new mongoose.Schema({
  blogUrl: String,
  fullText: String,
  createdAt: { type: Date, default: Date.now },
});

const Text = mongoose.models.Text || mongoose.model("Text", textSchema);

export async function connectMongoDB() {
  await mongoose.connect(process.env.MONGODB_URI!);
}

export async function saveToMongoDB(fullText: string, blogUrl: string) {
  await connectMongoDB();
  await Text.create({ blogUrl, fullText });
}