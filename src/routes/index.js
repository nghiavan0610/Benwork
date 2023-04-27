const v1Router = require('./v1');
const { notFound, errorHandler } = require('../helpers/ErrorHandler');

const route = (app) => {
    app.get('/api', (req, res, next) => {
        return res.status(200).json({
            status: 'success',
            message: 'Welcome to ToanTamEc API!',
        });
    });
    app.use('/api/v1', v1Router);

    app.use(errorHandler);
    app.use(notFound);
};

module.exports = route;
