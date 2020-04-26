import fs from 'fs';

export default function saveStatementFile(data) {
  const statement = data['statement-file'].data;
  const filePath = `tmp/statement-${Date.now()}.csv`;

  if (!statement) return false;

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, statement, 'latin1', (err) => {
      if (err) reject(err.message);

      resolve(filePath);
    });
  });
}
