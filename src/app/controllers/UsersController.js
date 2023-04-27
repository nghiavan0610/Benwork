const usersService = require('../services/UsersService');
const cloudinary = require('cloudinary').v2;
const { response } = require('../../helpers/Response');
const { ApiError } = require('../../helpers/ErrorHandler');

class UsersController {
    // [GET] /api/v1/users
    async getAllUsers(req, res, next) {
        try {
            const queryData = req.query;
            const users = await usersService.getAllUsers(queryData);
            res.status(200).json(response(users));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/v1/users/:userSlug
    async getUserBySlug(req, res, next) {
        try {
            const { userSlug } = req.params;
            const user = await usersService.getUserBySlug(userSlug);
            res.status(200).json(response({ user }));
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/v1/users/start-selling
    async startSelling(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;

            const userOnboarding = await usersService.startSelling(id, formData);
            res.status(201).json(response({ userOnboarding }));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/v1/users/create
    async createUser(req, res, next) {
        try {
            const formData = req.body;
            const user = await usersService.createUser(formData);
            res.status(201).json(response({ user }));
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/v1/users/:userSlug/profile/edit
    async updateUserAccount(req, res, next) {
        try {
            const formData = req.body;
            const { userSlug } = req.params;
            const authUser = req.user;
            const updatedUser = await usersService.updateUserAccount(userSlug, formData, authUser);
            res.status(201).json(response({ updatedUser }));
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/v1/users/:userSlug/security/edit
    async updateUserSecurity(req, res, next) {
        try {
            const formData = req.body;
            const { userSlug } = req.params;
            const authUser = req.user;
            await usersService.updateUserSecurity(userSlug, formData, authUser);
            res.status(200).json(response('Password updated successfully'));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/v1/users/deleted_users
    async getDeletedUser(req, res, next) {
        try {
            const deletedUsers = await usersService.getDeletedUser();
            res.status(200).json(response({ deletedUsers }));
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/v1/users/deleted_users/:userSlug/handle-delete-user
    async handleDeletedUser(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            const { userSlug } = req.params;
            await usersService.handleDeletedUser(id, userSlug, formData);
            res.status(200).json(response());
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new UsersController();
