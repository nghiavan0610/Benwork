const express = require('express');
const router = express.Router();
const complementController = require('../../app/controllers/ComplementController');
const { authenticateToken } = require('../../middlewares/AuthMiddleware');
const requireRole = require('../../middlewares/RoleMiddleware');

router.put('/:typeSlug/edit', authenticateToken, requireRole('admin'), complementController.editComplement);
router.delete('/:typeSlug/delete', authenticateToken, requireRole('admin'), complementController.deleteComplement);
router.post('/create', authenticateToken, requireRole('admin'), complementController.createComplement);
router.get('/:typeSlug', authenticateToken, complementController.getComplementBySlug);
router.get('/', authenticateToken, complementController.getAllComplements);

module.exports = router;
