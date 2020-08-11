import express from 'express';
import expressGraphql from 'express-graphql';
import connectDb from './server/services/database/connector.mjs';
import readSchema from './server/graphql/schema/index.mjs';

const app = express();
const { graphqlHTTP } = expressGraphql;

connectDb();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

readSchema()
  .then((schema) => {
    app.use('/graphql', graphqlHTTP({
      schema,
      rootValue: {},
    }));
  });

app.listen(process.env.PORT);

export default app;
