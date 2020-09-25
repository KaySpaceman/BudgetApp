import express from 'express';
import expressGraphql from 'express-graphql';
import connectDb from './server/services/database/connector.mjs';
import readSchema from './server/graphql/schema/index.mjs';
import resolvers from './server/graphql/resolvers/index.mjs';
import cors from 'cors';

const app = express();
const { graphqlHTTP } = expressGraphql;

connectDb();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000' }));

readSchema()
  .then((schema) => {
    app.use('/graphql', graphqlHTTP({
      schema,
      rootValue: resolvers,
      graphiql: true,
    }));
  });

app.listen(process.env.API_PORT);

export default app;
