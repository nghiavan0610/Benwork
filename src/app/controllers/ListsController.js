const listsService = require('../services/ListsService');
const { response } = require('../../helpers/Response');

class ListsController {
    // [GET] /api/v1/lists
    async getAllMyLists(req, res, next) {
        try {
            const { id } = req.user;
            const lists = await listsService.getAllMyLists(id);
            res.status(200).json(response({ lists }));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/v1/lists/:listId
    async getListById(req, res, next) {
        try {
            const { id } = req.user;
            const { listId } = req.params;
            const list = await listsService.getListById(id, listId);
            res.status(200).json(response({ list }));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/v1/lists/create
    async createList(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            const list = await listsService.createList(id, formData);
            res.status(201).json(response({ list }));
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/v1/lists/:listId
    async editList(req, res, next) {
        try {
            const { id } = req.user;
            const { listId } = req.params;
            const formData = req.body;
            const newList = await listsService.editList(id, listId, formData);
            res.status(201).json(response({ newList }));
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/v1/lists/:listId
    async deleteList(req, res, next) {
        try {
            const { id } = req.user;
            const { listId } = req.params;
            await listsService.deleteList(id, listId);
            res.status(200).json(response());
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/v1/list/:listId/save-item
    async saveItemToList(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            const { listId } = req.params;
            const savedItem = await listsService.saveItemToList(id, listId, formData);
            res.status(201).json(response({ [formData.tagType]: savedItem }));
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ListsController();
