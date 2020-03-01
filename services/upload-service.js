UploadService = function() {
    require('../config/config');

    const MongoClient = require('mongodb').MongoClient;
    const ColTransactions = 'Transactions';
    const url = new Config().buildMongoDbUrl();
    const DbName = global.gConfig.mongoDB;
    const client = new MongoClient(url);

    this.processStatementUpload = (data) => {
        client.connect((err, db) => {
            if (err) throw err;

            db.db(DbName).collection(ColTransactions).insertOne({
                TransactionID: 1,
                Amount: 4,
            });
        });
    };
};

exports.UploadService = UploadService;
