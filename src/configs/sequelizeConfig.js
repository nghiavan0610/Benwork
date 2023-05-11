const config = require('./env');
module.exports = {
    development: {
        username: 'nghia',
        password: 'nghia1234',
        database: 'fiverr_db_dev',
        host: '127.0.0.1',
        dialect: 'mysql',
        port: 3306,
        logging: console.log,
    },
    production: {
        use_env_variable: 'DATABASE_URL',
        dialect: 'mysql',
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false,
            },
        },
        pool: {
            max: 5,
            min: 0,
            idle: 10000,
        },
    },
};
