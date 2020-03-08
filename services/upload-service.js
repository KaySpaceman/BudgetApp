UploadService = function() {
    require('../config/config');

    const fs = require('fs');
    const csv = require('csv-parser');
    const MongoClient = require('mongodb').MongoClient;
    const ColTransactions = 'Transactions';
    const url = new Config().buildMongoDbUrl();
    const DbName = global.gConfig.mongoDB;
    const client = new MongoClient(url);

    this.processStatementUpload = (data) => {
        const pathPromise = this.saveStatementFile(data);

        if (!pathPromise) {
            return false;
        }

        pathPromise.then(path => {
            const rowPromise = this.extractTransactionData(path);

            rowPromise.then(rows => {
                let rowCount = 0;

                if (!rows || rows.length === 0) return false;

                // TODO: Move DB operations to new service
                try {
                    client.connect((err, db) => {
                        if (err) throw err;

                        const collection = db.db(DbName).collection(ColTransactions);

                        collection.insertMany(rows).then(() => {
                            rowCount = rows.length;
                        });
                    })
                } catch (err) {
                    console.log(err.message);
                }
            });
        });
    };

    this.saveStatementFile = (data) => {
        const statement = data['statement-file'].data;
        const filePath = 'tmp/statement-' + Date.now() + '.csv';

        if (!statement) return false;

        return new Promise(function(resolve, reject) {
            fs.writeFile(filePath, statement, 'latin1', (err) => {
                if (err) reject(err.message);

                resolve(filePath);
            });
        });
    };

    // TODO: Move parsing to new service
    this.extractTransactionData = (path) => {
        let statementRows = [];

        return new Promise(function(resolve, reject) {
            fs.createReadStream(path)
                .pipe(csv({ separator: '|' }, ['Name', 'Age']))
                .on('error', () => {
                    reject('Failed to parse CSV');
                })
                .on('data', (row) => {
                    statementRows.push({
                        'Date': row[0],
                        'Type': row[1],
                        'Note': row[2],
                        'No': row[3],
                        'Ref': row[4],
                        'Amount': row[5],
                        'Bank': 'Citadele'
                    });
                })
                .on('end', () => {
                    statementRows.splice(0, 3)
                        .splice(statementRows.length - 5, statementRows.length);

                    resolve(statementRows);
                })
        });

    };
};

exports.UploadService = UploadService;
