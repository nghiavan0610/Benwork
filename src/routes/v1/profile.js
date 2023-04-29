const express = require('express');
const router = express.Router();
const profileController = require('../../app/controllers/ProfileController');
const { authenticateToken } = require('../../middlewares/AuthMiddleware');
const uploadCloud = require('../../middlewares/UploadMiddleware');

router.put('/upload-avatar', authenticateToken, uploadCloud.single('avatar'), profileController.uploadAvatar);
router.put('/deactivate', authenticateToken, profileController.deactivateAccount);

router.post('/languages/selective-update', authenticateToken, profileController.updateProfileLanguage);
router.post('/skills/selective-update', authenticateToken, profileController.updateProfileSkill);
router.post('/education/selective-update', authenticateToken, profileController.updateProfileEducation);
router.post('/certification/selective-update', authenticateToken, profileController.updateProfileCertification);

module.exports = router;
