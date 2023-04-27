const express = require('express');
const router = express.Router();
const usersController = require('../../app/controllers/UsersController');
const { authenticateToken } = require('../../middlewares/AuthMiddleware');
const requireRole = require('../../middlewares/RoleMiddleware');

// admin handle users
router.post('/create', authenticateToken, requireRole('admin'), usersController.createUser);
router.get('/deleted_users', authenticateToken, requireRole('admin'), usersController.getDeletedUser);
router.delete(
    '/deleted_users/:userSlug/handle-delete-user',
    authenticateToken,
    requireRole('admin'),
    usersController.handleDeletedUser,
);

// users
router.put('/:userSlug/profile/edit', authenticateToken, usersController.updateUserAccount);
router.put('/:userSlug/security/edit', authenticateToken, usersController.updateUserSecurity);
router.put('/start-selling', authenticateToken, usersController.startSelling);
router.get('/:userSlug', usersController.getUserBySlug);
router.get('/', usersController.getAllUsers);

module.exports = router;
