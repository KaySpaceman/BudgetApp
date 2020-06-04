import mongoose from 'mongoose';

export function buildMongoDbUrl() {
  let url = process.env.MONGO_URL;

  if (!process.env.MONGO_USER && !process.env.MONGO_PASS) {
    url = url.replace(
      `${process.env.MONGO_USER_PLACEHOLDER}:${process.env.MONGO_PASS_PLACEHOLDER}@`, '',
    );
  } else {
    url = url.replace(process.env.MONGO_USER_PLACEHOLDER, process.env.MONGO_USER);
    url = url.replace(process.env.MONGO_PASS_PLACEHOLDER, encodeURI(process.env.MONGO_PASS));
  }

  return url;
}

export default function connectDb() {
  return mongoose.connect(buildMongoDbUrl(), { dbName: process.env.MONGO_DB });
}
