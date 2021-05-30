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
    process.exit(1);
  }
};

const closeDbConnection = async () => {
  await mongoose.connection.close().catch((error) => console.error(error));
};
export { connect, closeDbConnection };
