const v1Router = require('./v1');
const yaml = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const { notFound, errorHandler } = require('../helpers/ErrorHandler');
require('../helpers/Passport');

const route = (app) => {
    app.get('/api', (req, res, next) => {
        return res.status(200).json({
            status: 'success',
            message: 'Welcome to Benwork API - created by Nghia Van',
        });
    });
    app.use('/api/v1', v1Router);

    // swagger
    const openapiDocument = yaml.load('./openapi.yaml');
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(openapiDocument));

    app.use(errorHandler);
    app.use(notFound);
};

module.exports = route;
