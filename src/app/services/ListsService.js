const { ApiError } = require('../../helpers/ErrorHandler');
const { sequelize, User, Gig, List, Country, Collection } = require('../../db/models');

class ListsService {
    // [GET] /api/v1/lists
    async getAllMyLists(id) {
        try {
            const lists = await List.findAll({
                attributes: [
                    'id',
                    'name',
                    'description',
                    'slug',
                    [
                        sequelize.literal(
                            `(select count(*) from Collections where Collections.listId = List.id and Collections.tagType = "Gig")`,
                        ),
                        'total_gigs',
                    ],
                    [
                        sequelize.literal(
                            `(select count(*) from Collections where Collections.listId = List.id and Collections.tagType = "Seller")`,
                        ),
                        'total_sellers',
                    ],
                ],
                include: [
                    {
                        attributes: ['id', 'image'],
                        model: Gig,
                        as: 'CollectGigs',
                        through: {
                            attributes: [],
                        },
                    },
                    {
                        attributes: ['id', 'avatarUrl'],
                        model: User,
                        as: 'CollectSellers',
                        through: {
                            attributes: [],
                        },
                    },
                ],
                where: { userId: id },
            });
            return lists;
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/v1/lists/:listId
    async getListById(id, listId) {
        try {
            const list = await List.findOne({
                attributes: [
                    'id',
                    'name',
                    'description',
                    'slug',
                    'createdAt',
                    [
                        sequelize.literal(
                            `(select count(*) from Collections where Collections.listId = List.id and Collections.tagType = "Gig")`,
                        ),
                        'total_gigs',
                    ],
                    [
                        sequelize.literal(
                            `(select count(*) from Collections where Collections.listId = List.id and Collections.tagType = "Seller")`,
                        ),
                        'total_sellers',
                    ],
                ],

                include: [
                    {
                        attributes: [
                            'id',
                            'name',
                            'image',
                            'basicPrice',
                            'slug',
                            [
                                sequelize.literal(
                                    `(select cast(avg(Reviews.rating) AS decimal (10, 2)) from Reviews where Reviews.tagId = CollectGigs.id and Reviews.tagType = "Gig")`,
                                ),
                                'gig_review_rating',
                            ],
                            [
                                sequelize.literal(
                                    `(select count(*) from Reviews where Reviews.tagId = CollectGigs.id and Reviews.tagType = "Gig")`,
                                ),
                                'gig_review_count',
                            ],
                        ],
                        model: Gig,
                        as: 'CollectGigs',
                        through: {
                            attributes: [],
                        },
                        include: {
                            attributes: ['id', 'name', 'avatarUrl', 'slug'],
                            model: User,
                            as: 'GigOwner',
                            include: {
                                attributes: ['id', 'name'],
                                model: Country,
                            },
                        },
                    },
                    {
                        attributes: [
                            'id',
                            'name',
                            'avatarUrl',
                            'slug',
                            'memberSince',
                            [
                                sequelize.literal(
                                    `(select cast(avg(Reviews.rating) AS decimal (10, 2)) from Reviews where Reviews.tagId = CollectSellers.id and Reviews.tagType = "Seller")`,
                                ),
                                'seller_review_rating',
                            ],
                            [
                                sequelize.literal(
                                    `(select count(*) from Reviews where Reviews.tagId = CollectSellers.id and Reviews.tagType = "Seller")`,
                                ),
                                'seller_review_count',
                            ],
                        ],
                        model: User,
                        as: 'CollectSellers',
                        through: {
                            attributes: [],
                        },
                        include: {
                            attributes: ['id', 'name'],
                            model: Country,
                        },
                    },
                ],
                where: { id: listId, userId: id },
            });
            if (!list) throw new ApiError(404, `List '${listId}' was not found or not your list`);

            return list;
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/v1/lists/create
    async createList(id, formData) {
        try {
            const { name, description } = formData;
            const list = await List.create({
                name,
                description,
                userId: id,
            });
            return list;
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/v1/lists/:listId
    async editList(id, listId, formData) {
        try {
            const newList = await List.update(formData, { where: { id: listId, userId: id } });
            if (!newList[0] && !newList[1][0]) {
                throw new ApiError(404, `List '${listId}' was not found or not your list`);
            }
            return newList[1][0];
        } catch (err) {
            throw err;
        }
    }

    // [DELETE] /api/v1/lists/:listId
    async deleteList(id, listId) {
        try {
            const deleted = await List.destroy({ where: { id: listId, userId: id } });
            if (!deleted) {
                throw new ApiError(404, `List '${listId}' was not found or not your list`);
            }
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/v1/lists/:listId/save-item
    async saveItemToList(id, listId, formData) {
        try {
            const { tagId, tagType } = formData;

            if (!(tagType === 'Gig' || tagType === 'Seller')) {
                throw new ApiError(403, `Unknow tag type item: '${tagType}'`);
            }
            const [list, item] = await Promise.all([
                List.findByPk(listId, { attributes: ['id', 'userId'] }),
                tagType === 'Gig'
                    ? Gig.findByPk(tagId, { attributes: ['id'] })
                    : User.findOne({ attributes: ['id'], where: { id: tagId, role: 'seller' } }),
            ]);

            if (!list) throw new ApiError(404, `List '${listId}' was not found`);
            if (list.userId !== id) throw new ApiError(401, `1 permission to perform this action`);

            if (!item) throw new ApiError(404, `${tagType} '${tagId}' was not found`);

            const [savedItem, created] = await Collection.findOrCreate({
                where: { listId, tagId, tagType },
                defaults: {},
            });
            if (!created) {
                await savedItem.destroy();
                return;
            }

            return savedItem;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new ListsService();
