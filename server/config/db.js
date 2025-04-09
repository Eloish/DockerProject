import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     process.exit(1);
//   }
// };
const connectDB = () => {
  
  mongoose.connect('mongodb://127.0.0.1:27017/diary', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

export default connectDB;
