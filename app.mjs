import express from 'express';
import connectDb from './services/database/connector.mjs';
import graphqlHttp from 'express-graphql';
import { buildSchema } from 'graphql';

const app = express();

connectDb();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
    schema {
      query:
      mutation:
    }
  `),
  rootValue: {

  }
}));

app.listen(process.env.PORT);

export default app;
