const { ApiError } = require('../../helpers/ErrorHandler');
const models = require('../../db/models');
const { GigCategory, GigSubCategory, GigService } = models;

const defineModel = (type) => {
    let modelName;
    switch (true) {
        case /^gig_categories/.test(type):
            modelName = 'GigCategory';
            break;
        case /^gig_sub_categories/.test(type):
            modelName = 'GigSubCategory';
            break;
        case /^gig_services/.test(type):
            modelName = 'GigService';
            break;
        default:
            throw new ApiError(405, `Unknown type: '${type}'`);
    }
    return modelName;
};

class CategoriesService {
    // categories
    // [GET] /api/v1/categories
    async getAllCategories(type) {
        try {
            const modelName = defineModel(type);
            const categories = await models[modelName].findAll();
            return categories;
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/v1/categories/:gigCategorySlug
    async getCategoryBySlug(gigCategorySlug) {
        try {
            const category = await GigCategory.findOne({
                attributes: ['id', 'name', 'slug'],
                include: {
                    attributes: ['id', 'name', 'slug'],
                    model: GigSubCategory,
                },
                where: { slug: gigCategorySlug },
            });
            if (!category) throw new ApiError(404, `Gig category with slug='${gigCategorySlug}' was not found`);

            return category;
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/v1/categories/selective-update
    async updateCategory(formData) {
        try {
            const { id, name, method } = formData;
            switch (method) {
                case 'create':
                    await GigCategory.create({ name });
                    break;
                case 'update':
                    const updated = await GigCategory.update({ name }, { where: { id } });
                    if (!updated[0] && !updated[1][0]) {
                        throw new ApiError(404, `Gig category '${id}' was not found to edit`);
                    }
                    break;
                case 'delete':
                    const deleted = await GigCategory.destroy({ where: { id } });
                    if (!deleted) throw new ApiError(404, `Gig category '${id}' was not found to delete`);
                    break;
                default:
                    throw new ApiError(405, `Invalid method '${method}'`);
            }
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new ApiError(403, `This gig category already exists`);
            }
            throw err;
        }
    }

    // [GET] /api/v1/categories/sub_categories/:gigSubCategorySlug
    async getSubCategoryBySlug(gigSubCategorySlug) {
        try {
            const subCategory = await GigSubCategory.findOne({
                attributes: ['id', 'name', 'gigCategoryId', 'slug'],
                include: [
                    { attributes: ['id', 'name', 'slug'], model: GigCategory },
                    { attributes: ['id', 'name', 'slug'], model: GigService },
                ],
                where: { slug: gigSubCategorySlug },
            });
            if (!subCategory) throw new ApiError(404, `Gig sub_category ='${gigSubCategorySlug}' was not found`);

            return subCategory;
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/v1/categories/sub_categories/selective-update
    async updateSubCategory(formData) {
        try {
            const { id, name, gigCategoryId, method } = formData;
            if (method !== 'delete') {
                const category = await GigCategory.findByPk(gigCategoryId, { attributes: ['id'] });
                if (!category) throw new ApiError(404, `Gig category '${gigCategoryId}' was not found`);
            }

            switch (method) {
                case 'create':
                    await GigSubCategory.create({ name, gigCategoryId });
                    break;
                case 'update':
                    const updated = await GigSubCategory.update({ name, gigCategoryId }, { where: { id } });
                    if (!updated[0] && !updated[1][0]) {
                        throw new ApiError(404, `Gig sub_category '${id}' was not found to edit`);
                    }
                    break;
                case 'delete':
                    const deleted = await GigSubCategory.destroy({ where: { id } });
                    if (!deleted) throw new ApiError(404, `Gig sub_category '${id}' was not found to delete`);
                    break;
                default:
                    throw new ApiError(405, `Invalid method '${method}'`);
            }
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new ApiError(403, 'This gig sub_category already exists');
            }
            throw err;
        }
    }

    // [GET] /api/v1/categories/services/:gigServiceSlug
    async getServiceBySlug(gigServiceSlug) {
        try {
            const service = await GigService.findOne({
                attributes: ['id', 'name', 'gigSubCategoryId', 'slug'],
                include: {
                    attributes: ['id', 'name', 'slug'],
                    model: GigSubCategory,
                    include: {
                        attributes: ['id', 'name', 'slug'],
                        model: GigCategory,
                    },
                },
                where: { slug: gigServiceSlug },
            });
            if (!service) throw new ApiError(404, `Gig service '${gigServiceSlug}' was not found`);

            return service;
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/v1/categories/services/selective-update
    async updateService(formData) {
        try {
            const { id, name, gigSubCategoryId, method } = formData;
            if (method !== 'delete') {
                const category = await GigSubCategory.findByPk(gigSubCategoryId, { attributes: ['id'] });
                if (!category) throw new ApiError(404, `Gig sub_category '${gigSubCategoryId}' was not found`);
            }

            switch (method) {
                case 'create':
                    await GigService.create({ name, gigSubCategoryId });
                    break;
                case 'update':
                    const updated = await GigService.update({ name, gigSubCategoryId }, { where: { id } });
                    if (!updated[0] && !updated[1][0]) {
                        throw new ApiError(404, `Gig service '${id}' was not found to edit`);
                    }
                    break;
                case 'delete':
                    const deleted = await GigService.destroy({ where: { id } });
                    if (!deleted) throw new ApiError(404, `Gig service '${id}' was not found to delete`);
                    break;
                default:
                    throw new ApiError(405, `Invalid method '${method}'`);
            }
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new ApiError(403, 'This gig service already exists');
            }
            throw err;
        }
    }
}

module.exports = new CategoriesService();
