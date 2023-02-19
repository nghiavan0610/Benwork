const config = require('./env');
module.exports = {
    development: {
        username: config.DB_USER,
        password: config.DB_PASSWORD,
        database: config.DB_NAME,
        host: config.DB_HOST,
        dialect: config.DB_DIALECT,
        port: config.DB_PORT,
        // logging: true,
    },
    production: {
        username: config.DB_USER,
        password: config.DB_PASSWORD,
        database: config.DB_NAME,
        host: config.DB_HOST,
        dialect: config.DB_DIALECT,
        port: config.DB_PORT,
        // logging: true,
    },
};
