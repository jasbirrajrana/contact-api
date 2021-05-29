import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });

    console.log("mongo connected!");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
export { connect };
