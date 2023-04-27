const express = require('express');
const router = express.Router();
const ordersController = require('../../app/controllers/OrdersController');
const { authenticateToken } = require('../../middlewares/AuthMiddleware');

// leave review
router.post('/:tagSlug/leave-review', authenticateToken, ordersController.createReview);

// order gigs
router.post('/create', authenticateToken, ordersController.createOrder);
router.put('/complete', authenticateToken, ordersController.completeOrder);
router.get('/:orderId', authenticateToken, ordersController.getOrderById);
router.get('/', authenticateToken, ordersController.getAllOrders);

module.exports = router;
