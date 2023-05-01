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
    },
    // production: {
    //     username: config.DB_USER,
    //     password: config.DB_PASSWORD,
    //     database: config.DB_NAME,
    //     host: config.DB_HOST,
    //     port: config.DB_LOCAL_PORT,
    //     dialect: 'mysql',
    //     dialectOptions: {
    //         ssl: {
    //             rejectUnauthorized: false,
    //         },
    //     },
    // },
};
