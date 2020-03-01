Config = function () {
    const _ = require('lodash');
    const config = require('../config.json');

    const DB_USER = 'USERNAME';
    const DB_PASS = 'PASSWORD';

    const defaultConfig = config.development;
    const environment = process.env.NODE_ENV || 'development';
    const environmentConfig = config[environment];
    global.gConfig = _.merge(defaultConfig, environmentConfig);

    this.buildMongoDbUrl = function() {
        const rawUrl = environmentConfig.mongoUrl;

        let url = rawUrl.replace(DB_USER, environmentConfig.mongoUser);
        url = url.replace(DB_PASS, environmentConfig.mongoPass);

        return url;
    };
};

exports.Config = Config;
