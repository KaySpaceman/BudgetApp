import mongoose from 'mongoose';
import buildMongoDbUrl from '../../config/config.mjs';

export default function connectDb() {
  return mongoose.connect(buildMongoDbUrl(), { dbName: process.env.MONGO_DB });
}
