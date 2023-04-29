const express = require('express');
const router = express.Router();
const gigsController = require('../../app/controllers/GigsController');
const { authenticateToken } = require('../../middlewares/AuthMiddleware');
const requireRole = require('../../middlewares/RoleMiddleware');
const uploadCloud = require('../../middlewares/UploadMiddleware');

router.post('/create', authenticateToken, gigsController.createGig);
router.post('/:gigSlug/upload-image', authenticateToken, uploadCloud.single('image'), gigsController.uploadGigImage);
router.put('/:gigSlug/edit', authenticateToken, gigsController.editGig);
router.put('/:gigSlug/delete', authenticateToken, gigsController.deleteGig);

router.get('/:gigSlug', gigsController.getGigBySlug);
router.get('/', gigsController.getAllGigs);

module.exports = router;
