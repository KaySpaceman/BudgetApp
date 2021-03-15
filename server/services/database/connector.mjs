import mongoose from 'mongoose';

export default function connectDb() {
  const {
    MONGO_USERNAME, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_DATABASE,
  } = process.env;

  return mongoose.connect(`mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
