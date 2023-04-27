const { ApiError } = require('../../helpers/ErrorHandler');
const models = require('../../db/models');

const defineModel = (type) => {
    let modelName;
    switch (true) {
        case /^skills/.test(type):
            modelName = 'Skill';
            break;
        case /^languages/.test(type):
            modelName = 'Language';
            break;
        case /^universities/.test(type):
            modelName = 'University';
            break;
        case /^countries/.test(type):
            modelName = 'Country';
            break;
        case /^majors/.test(type):
            modelName = 'Major';
            break;
        case /^titles/.test(type):
            modelName = 'AcademicTitle';
            break;
        default:
            throw new ApiError(405, `Unknown type: '${type}'`);
    }
    return modelName;
};

class ComplementService {
    // [GET] /api/v1/complement
    async getAllComplements(type) {
        try {
            const modelName = defineModel(type);
            const complements = await models[modelName].findAll();
            return complements;
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/v1/complement/:typeSlug
    async getComplementBySlug(type, typeSlug) {
        try {
            const modelName = defineModel(type);
            const complement = await models[modelName].findOne({ where: { slug: typeSlug } });
            if (!complement) throw new ApiError(404, `${modelName} with slug='${typeSlug}' was not found`);

            return complement;
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/v1/complement/create
    async createComplement(formData) {
        try {
            const { name, type } = formData;
            const modelName = defineModel(type);

            const [complement, created] = await models[modelName].findOrCreate({
                where: { name },
                defaults: {},
            });
            if (!created) throw new ApiError(409, `${modelName} '${name}' already exists`);
            return complement;
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/v1/complement/edit
    async editComplement(formData) {
        try {
            const { typeId, name, type } = formData;
            const modelName = defineModel(type);

            const complement = await models[modelName].update({ name }, { where: { id: typeId } });

            if (!complement[0] && !complement[1][0]) {
                throw new ApiError(404, `${modelName} '${typeId}' was not found`);
            }
            return complement[1][0];
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new ApiError(403, `This name already exists`);
            }
            throw err;
        }
    }

    // [DELETE] /api/v1/complement/delete
    async deleteComplement(formData) {
        try {
            const { typeId, type } = formData;
            const modelName = defineModel(type);

            const deleted = await models[modelName].destroy({
                where: { id: typeId },
                force: true,
            });
            if (!deleted) throw new ApiError(404, `${modelName} '${typeId}' was not found`);
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new ComplementService();
