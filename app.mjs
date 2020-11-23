import express from 'express';
import expressGraphql from 'express-graphql';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDb from './server/services/database/connector.mjs';
import readSchema from './server/graphql/schema/index.mjs';
import resolvers from './server/graphql/resolvers/index.mjs';
import uploadRouter from './server/rest/upload.mjs';

const restApp = express();
const graphqlApp = express();
const { graphqlHTTP } = expressGraphql;

connectDb();
restApp.use(express.json()); // TODO: Split rest and graphql apps to individual containers
restApp.use(express.urlencoded({ extended: true }));
restApp.use(cors());
graphqlApp.use(cors());

restApp.use('/upload', uploadRouter);

readSchema()
  .then((schema) => {
    graphqlApp.use('/', graphqlHTTP({
      schema,
      rootValue: resolvers,
      graphiql: true,
    }));
  });

graphqlApp.get('/readiness', async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.status(200)
      .send('GraphQL container is ready to process requests');
  } else {
    res.status(500)
      .send('GraphQL container hasn\'t connected to the database');
  }
});

// TODO: Use /readiness and move to router once switched to multiple containers
restApp.get('/', async (req, res) => {
  res.status(200)
    .send('REST container is ready to process requests');
});

graphqlApp.listen(process.env.GRAPHQL_PORT);
restApp.listen(process.env.REST_PORT);
