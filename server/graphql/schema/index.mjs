import graphql from 'graphql';
import path from 'path';
import fs from 'fs';

const { buildSchema } = graphql;

export default async () => {
  try {
    const schemaFile = await fs.readFileSync(path.resolve('schema.graphql'));

    if (!schemaFile) {
      return '';
    }

    return buildSchema(schemaFile.toString());
  } catch (err) {
    return '';
  }
};
