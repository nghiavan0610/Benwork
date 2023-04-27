const express = require('express');
const router = express.Router();
const categoriesController = require('../../app/controllers/CategoriesController');
const { authenticateToken } = require('../../middlewares/AuthMiddleware');
const requireRole = require('../../middlewares/RoleMiddleware');

// gig categories
router.get('/:gigCategorySlug', authenticateToken, categoriesController.getCategoryBySlug);
router.post('/selective-update', authenticateToken, requireRole('admin'), categoriesController.updateCategory);
// gig sub categories
router.get('/sub_categories/:gigSubCategorySlug', authenticateToken, categoriesController.getSubCategoryBySlug);
router.post(
    '/sub_categories/selective-update',
    authenticateToken,
    requireRole('admin'),
    categoriesController.updateSubCategory,
);
// gig services
router.get('/services/:gigServiceSlug', authenticateToken, categoriesController.getServiceBySlug);
router.post('/services/selective-update', authenticateToken, requireRole('admin'), categoriesController.updateService);
router.get('/', authenticateToken, categoriesController.getAllCategories);

module.exports = router;
