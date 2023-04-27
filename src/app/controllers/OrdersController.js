const ordersService = require('../services/OrdersService');
const { response } = require('../../helpers/Response');
const cloudinary = require('cloudinary').v2;

class OrdersController {
    // [POST] /api/v1/:tagSlug/leave-review
    async createReview(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            const { tagSlug } = req.params;
            const review = await ordersService.createReview(id, tagSlug, formData);
            res.status(201).json(response({ review }));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/v1/orders
    async getAllOrders(req, res, next) {
        try {
            const { id } = req.user;
            const user = await ordersService.getAllOrders(id);
            res.status(200).json(response({ user }));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/v1/orders/:orderId
    async getOrderById(req, res, next) {
        try {
            const { id } = req.user;
            const { orderId } = req.params;
            const order = await ordersService.getOrderById(id, orderId);
            res.status(200).json(response({ order }));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/v1/orders/create
    async createOrder(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            const order = await ordersService.createOrder(id, formData);
            res.status(201).json(response({ order }));
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/v1/orders/complete
    async completeOrder(req, res, next) {
        try {
            const { id } = req.user;
            const { orderId } = req.body;
            await ordersService.completeOrder(id, orderId);
            res.status(201).json(response());
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new OrdersController();
