import mongoose from 'mongoose';

if (!mongoose.connections[0].readyState) {
  await mongoose.connect(process.env.MONGODB_URI!);
}
export default mongoose;
