import express from 'express';
import expressGraphql from 'express-graphql';
import cors from 'cors';
import connectDb from './server/services/database/connector.mjs';
import readSchema from './server/graphql/schema/index.mjs';
import resolvers from './server/graphql/resolvers/index.mjs';
import uploadRouter from './server/rest/upload.mjs';

const app = express();
const { graphqlHTTP } = expressGraphql;

connectDb();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000' }));
app.use('/upload', uploadRouter);

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
