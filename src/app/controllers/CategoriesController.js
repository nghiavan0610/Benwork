const categoriesService = require('../services/CategoriesService');
const { response } = require('../../helpers/Response');

class CategoriesController {
    // categories
    // [GET] /api/v1/categories
    async getAllCategories(req, res, next) {
        try {
            const { type } = req.query;
            const categories = await categoriesService.getAllCategories(type);
            res.status(200).json(response({ [type]: categories }));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/v1/categories/:gigCategorySlug
    async getCategoryBySlug(req, res, next) {
        try {
            const { gigCategorySlug } = req.params;
            const gigCategory = await categoriesService.getCategoryBySlug(gigCategorySlug);
            res.status(200).json(response({ gigCategory }));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/v1/categories/selective-update
    async updateCategory(req, res, next) {
        try {
            const formData = req.body;
            await categoriesService.updateCategory(formData);
            res.status(201).json(response());
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/v1/categories/sub_categories/:gigSubCategorySlug
    async getSubCategoryBySlug(req, res, next) {
        try {
            const { gigSubCategorySlug } = req.params;
            const gigSubCategory = await categoriesService.getSubCategoryBySlug(gigSubCategorySlug);
            res.status(200).json(response({ gigSubCategory }));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/v1/categories/sub_categories/selective-update
    async updateSubCategory(req, res, next) {
        try {
            const formData = req.body;
            await categoriesService.updateSubCategory(formData);
            res.status(201).json(response());
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/v1/categories/services/:gigServiceSlug
    async getServiceBySlug(req, res, next) {
        try {
            const { gigServiceSlug } = req.params;
            const gigService = await categoriesService.getServiceBySlug(gigServiceSlug);
            res.status(200).json(response({ gigService }));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/v1/categories/services/selective-update
    async updateService(req, res, next) {
        try {
            const formData = req.body;
            await categoriesService.updateService(formData);
            res.status(201).json(response());
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new CategoriesController();
