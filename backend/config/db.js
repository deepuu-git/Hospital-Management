import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://deepa102004_db_user:VTeM6c78UpacN6G0@cluster0.6z1x7hz.mongodb.net/LifeCare?retryWrites=true&w=majority",
    );

    console.log("DB CONNECTED");
  } catch (error) {
    console.log("DB ERROR:", error.message);
  }
};
