const profileService = require('../services/ProfileService');
const cloudinary = require('cloudinary').v2;
const { response } = require('../../helpers/Response');
const { ApiError } = require('../../helpers/ErrorHandler');

class ProfileController {
    // [PUT] /api/v1/profile/upload-avatar
    async uploadAvatar(req, res, next) {
        try {
            const authUser = req.user;
            if (!req.file) throw new ApiError(404, 'Please upload a file');

            const avatarUrl = req.file.path;
            const newAvatar = await profileService.uploadAvatar(authUser, avatarUrl);
            res.status(201).json(response({ newAvatar }));
        } catch (err) {
            if (req.file) {
                await cloudinary.uploader.destroy(req.file.filename);
            }
            next(err);
        }
    }

    // [DELETE] /api/profile/deactivate
    async deactivateAccount(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            await settingService.deactivateAccount(id, formData);
            res.status(200).json(response('Account has been deactivated'));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/v1/profile/languages/selective-update
    async updateProfileLanguage(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            await profileService.updateProfileLanguage(id, formData);
            res.status(201).json(response());
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/v1/profile/skills/selective-update
    async updateProfileSkill(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            await profileService.updateProfileSkill(id, formData);
            res.status(201).json(response());
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/v1/profile/education/selective-update
    async updateProfileEducation(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            await profileService.updateProfileEducation(id, formData);
            res.status(201).json(response());
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/v1/profile/certification/selective-update
    async updateProfileCertification(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            await profileService.updateProfileCertification(id, formData);
            res.status(201).json(response());
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ProfileController();
