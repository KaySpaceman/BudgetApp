import fs from 'fs';

export default function saveStatementFile(data) {
  const statement = data['statement-file'].data;
  const filePath = `tmp/statement-${Date.now()}.csv`;

  if (!statement) return false;

  return new Promise((resolve) => {
    fs.writeFile(filePath, statement, 'latin1', (err) => {
      if (err) throw new Error(`Couldn't save uploaded file: ${err.message}`);

      resolve(filePath);
    });
  });
}
