const gigsService = require('../services/GigsService');
const { response } = require('../../helpers/Response');
const cloudinary = require('cloudinary').v2;
const { ApiError } = require('../../helpers/ErrorHandler');

class GigsController {
    // [GET] /api/v1/gigs
    async getAllGigs(req, res, next) {
        try {
            const queryData = req.query;
            const gigs = await gigsService.getAllGigs(queryData);
            res.status(200).json(response(gigs));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/v1/gigs/:gigSlug
    async getGigBySlug(req, res, next) {
        try {
            const { gigSlug } = req.params;
            const gig = await gigsService.getGigBySlug(gigSlug);
            res.status(200).json(response({ gig }));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/v1/gigs/create
    async createGig(req, res, next) {
        try {
            const authUser = req.user;
            const formData = req.body;
            const gig = await gigsService.createGig(authUser, formData);
            res.status(201).json(response({ gig }));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/v1/gigs/:gigSlug/upload-image
    async uploadGigImage(req, res, next) {
        try {
            const authUser = req.user;
            const { gigSlug } = req.params;

            if (!req.file) {
                throw new ApiError(404, 'Please upload a file');
            }
            const image = req.file.path;
            const gigImage = await gigsService.uploadGigImage(authUser, gigSlug, image);
            res.status(201).json(response({ gigImage }));
        } catch (err) {
            if (req.file) {
                await cloudinary.uploader.destroy(req.file.filename);
            }
            next(err);
        }
    }

    // [PUT] /api/v1/gigs/:gigSlug/edit
    async editGig(req, res, next) {
        try {
            const authUser = req.user;
            const { gigSlug } = req.params;
            const formData = req.body;
            const gig = await gigsService.editGig(authUser, gigSlug, formData);
            res.status(201).json(response({ gig }));
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/v1/gigs/:gigSlug/delete
    async deleteGig(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            const { gigSlug } = req.params;
            await gigsService.deleteGig(id, gigSlug, formData);
            res.status(200).json(response('Gig deleted successfully'));
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/v1/gigs/:gigSlug/admin-delete
    async adminDeleteGig(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            const { gigSlug } = req.params;
            await gigsService.adminDeleteGig(id, gigSlug, formData);
            res.status(200).json(response('Gig has been removed'));
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new GigsController();
