const complementService = require('../services/ComplementService');
const { response } = require('../../helpers/Response');

class ComplementController {
    // [GET] /api/v1/complement
    async getAllComplements(req, res, next) {
        try {
            const { type } = req.query;
            const complements = await complementService.getAllComplements(type);
            res.status(200).json(response({ [type]: complements }));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/v1/complement/:typeSlug
    async getComplementBySlug(req, res, next) {
        try {
            const { type } = req.query;
            const { typeSlug } = req.params;
            const complement = await complementService.getComplementBySlug(type, typeSlug);
            res.status(200).json(response({ [type]: complement }));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/v1/complement/create
    async createComplement(req, res, next) {
        try {
            const { type } = req.query;
            const formData = req.body;
            const complement = await complementService.createComplement(type, formData);
            res.status(201).json(response({ [type]: complement }));
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/v1/complement/:typeSlug/edit
    async editComplement(req, res, next) {
        try {
            const { type } = req.query;
            const { typeSlug } = req.params;
            const formData = req.body;
            const complement = await complementService.editComplement(type, typeSlug, formData);
            res.status(201).json(response({ [type]: complement }));
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/v1/complement/:typeSlug/delete
    async deleteComplement(req, res, next) {
        try {
            const { type } = req.query;
            const { typeSlug } = req.params;
            await complementService.deleteComplement(type, typeSlug);
            res.status(200).json(response());
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ComplementController();
