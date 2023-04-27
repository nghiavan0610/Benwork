const express = require('express');
const router = express.Router();
const listsController = require('../../app/controllers/ListsController');
const { authenticateToken } = require('../../middlewares/AuthMiddleware');

// Save items to list
router.post('/:listId/save-item', authenticateToken, listsController.saveItemToList);

router.post('/create', authenticateToken, listsController.createList);
router.put('/:listId', authenticateToken, listsController.editList);
router.delete('/:listId', authenticateToken, listsController.deleteList);

router.get('/:listId', authenticateToken, listsController.getListById);
router.get('/', authenticateToken, listsController.getAllMyLists);

module.exports = router;
