import mongodb from 'mongodb';
import buildMongoDbUrl from '../../config/config.mjs';

export default function connectDb() {
  return new Promise((resolve, reject) => {
    mongodb.connect(buildMongoDbUrl(), {}, (err, client) => {
      if (err) {
        reject(err);
      } else {
        resolve(client.db(process.env.MONGO_DB));
      }
    });
  });
}
