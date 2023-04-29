const { ApiError } = require('../../helpers/ErrorHandler');
const cloudinary = require('cloudinary').v2;
const {
    sequelize,
    User,
    Gig,
    GigService,
    GigSubCategory,
    GigCategory,
    UserLanguage,
    Language,
    Review,
    Country,
} = require('../../db/models');
const { gigFilterClause } = require('../../helpers/FilterClause');

class GigsService {
    // [GET] /api/v1/gigs
    async getAllGigs(queryData) {
        try {
            const { where, order, page, offset, limit } = gigFilterClause(queryData);

            const gigs = await Gig.findAndCountAll({
                attributes: [
                    'id',
                    'name',
                    'image',
                    'description',
                    'basicPrice',
                    'basicAbout',
                    'standardPrice',
                    'standardAbout',
                    'premiumPrice',
                    'premiumAbout',
                    'slug',
                    'createdAt',
                    [
                        sequelize.literal(`(select count(*) from Orders where Orders.gigId = Gig.id)`),
                        'gig_selling_quantity',
                    ],
                    [
                        sequelize.literal(
                            `(select cast(avg(Reviews.rating) AS decimal (10, 2)) from Reviews where Reviews.tagId = Gig.id and Reviews.tagType = "Gig")`,
                        ),
                        'review_rating',
                    ],
                    [
                        sequelize.literal(
                            `(select count(*) from Reviews where Reviews.tagId = Gig.id and Reviews.tagType = "Gig")`,
                        ),
                        'review_count',
                    ],
                ],
                include: [
                    {
                        attributes: ['id', 'name', 'avatarUrl', 'slug'],
                        model: User,
                        as: 'GigOwner',
                        include: {
                            attributes: ['id', 'name'],
                            model: Country,
                        },
                    },
                    {
                        attributes: ['id', 'name'],
                        model: GigService,
                        include: {
                            attributes: ['id', 'name'],
                            model: GigSubCategory,
                            include: {
                                attributes: ['id', 'name'],
                                model: GigCategory,
                            },
                        },
                    },
                ],
                where,
                order,
                limit,
                offset,
                distinct: true,
                col: 'id',
            });
            if (gigs.count === 0) {
                throw new ApiError(404, 'No Servives found for your search');
            }
            const totalPages = Math.ceil(gigs.count / limit);
            return {
                gigs: gigs.rows,
                page,
                totalGigs: gigs.count,
                totalPages,
            };
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/v1/gigs/:gigSlug
    async getGigBySlug(gigSlug) {
        try {
            const gig = await Gig.findOne({
                attributes: [
                    'id',
                    'name',
                    'image',
                    'description',
                    'basicPrice',
                    'basicAbout',
                    'standardPrice',
                    'standardAbout',
                    'premiumPrice',
                    'premiumAbout',
                    'slug',
                    'createdAt',
                    [
                        sequelize.literal(`(select count(*) from Orders where Orders.gigId = Gig.id)`),
                        'gig_selling_quantity',
                    ],
                    [
                        sequelize.literal(
                            `(select cast(avg(Reviews.rating) AS decimal (10, 2)) from Reviews where Reviews.tagId = Gig.id and Reviews.tagType = "Gig")`,
                        ),
                        'gig_review_rating',
                    ],
                    [
                        sequelize.literal(
                            `(select count(*) from Reviews where Reviews.tagId = Gig.id and Reviews.tagType = "Gig")`,
                        ),
                        'gig_total_review',
                    ],
                    [
                        sequelize.literal(
                            `(select count(*) from Reviews where Reviews.tagId = Gig.id and Reviews.tagType = "Gig" and Reviews.rating = 5)`,
                        ),
                        'gig_review_5_count',
                    ],
                    [
                        sequelize.literal(
                            `(select count(*) from Reviews where Reviews.tagId = Gig.id and Reviews.tagType = "Gig" and Reviews.rating = 4)`,
                        ),
                        'gig_review_4_count',
                    ],
                    [
                        sequelize.literal(
                            `(select count(*) from Reviews where Reviews.tagId = Gig.id and Reviews.tagType = "Gig" and Reviews.rating = 3)`,
                        ),
                        'gig_review_3_count',
                    ],
                    [
                        sequelize.literal(
                            `(select count(*) from Reviews where Reviews.tagId = Gig.id and Reviews.tagType = "Gig" and Reviews.rating = 2)`,
                        ),
                        'gig_review_2_count',
                    ],
                    [
                        sequelize.literal(
                            `(select count(*) from Reviews where Reviews.tagId = Gig.id and Reviews.tagType = "Gig" and Reviews.rating = 1)`,
                        ),
                        'gig_review_1_count',
                    ],
                ],
                include: [
                    {
                        attributes: [
                            'id',
                            'name',
                            'avatarUrl',
                            'slug',
                            [
                                sequelize.literal(
                                    `(select cast(avg(Reviews.rating) AS decimal (10, 2)) from Reviews where Reviews.tagId = GigOwner.id and Reviews.tagType = "Seller")`,
                                ),
                                'seller_review_rating',
                            ],

                            [
                                sequelize.literal(
                                    `(select count(*) from Reviews where Reviews.tagId = GigOwner.id and Reviews.tagType = "Seller")`,
                                ),
                                'seller_total_review',
                            ],
                        ],
                        model: User,
                        as: 'GigOwner',
                        include: [
                            {
                                attributes: ['id', 'name'],
                                model: Country,
                            },
                            {
                                attributes: ['id', 'level'],
                                model: UserLanguage,
                                include: {
                                    attributes: ['id', 'name', 'slug'],
                                    model: Language,
                                },
                            },
                        ],
                    },
                    {
                        attributes: ['id', 'name'],
                        model: GigService,
                        include: {
                            attributes: ['id', 'name'],
                            model: GigSubCategory,
                            include: {
                                attributes: ['id', 'name'],
                                model: GigCategory,
                            },
                        },
                    },
                    {
                        attributes: ['id', 'rating', 'content', 'reviewDate'],
                        model: Review,
                        as: 'ReviewBody',
                        include: {
                            attributes: ['id', 'name', 'avatarUrl', 'slug'],
                            model: User,
                            as: 'ReviewOwner',
                        },
                    },
                ],
                where: { slug: gigSlug },
                order: [['ReviewBody', 'reviewDate', 'DESC']],
            });
            if (!gig) {
                throw new ApiError(404, `Gig with slug='${gigSlug}' was not found`);
            }
            return gig;
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/v1/gigs/create
    async createGig(authUser, formData) {
        try {
            const { gigServiceId, gigSubCategoryId, gigCategoryId, ...gigData } = formData;

            if (authUser.role !== 'seller') throw new ApiError(406, 'You need to be a seller first');

            const gigCategory = await GigCategory.findByPk(gigCategoryId, { attributes: ['id', 'name'] });
            if (!gigCategory) throw new ApiError(404, `Gig category '${gigCategoryId}' was not found`);

            const gigSubCategory = await GigSubCategory.findAll({
                attributes: ['id', 'name'],
                where: { id: gigSubCategoryId, gigCategoryId },
                limit: 1,
            });
            if (!gigSubCategory[0]) {
                throw new ApiError(
                    406,
                    `Gig sub_category '${gigSubCategoryId}' was not found or not in Category ${gigCategoryId}`,
                );
            }

            const gigService = await GigService.findAll({
                attributes: ['id', 'name'],
                where: { id: gigServiceId, gigSubCategoryId },
                limit: 1,
            });
            if (!gigService[0]) {
                throw new ApiError(
                    406,
                    `Gig service '${gigServiceId}' was not found or not in Sub_category ${gigSubCategoryId}`,
                );
            }

            const gig = await Gig.create({
                ...gigData,
                sellerId: authUser.id,
                gigServiceId,
            });

            return gig;
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/v1/gigs/:gigSlug/upload-image
    async uploadGigImage(authUser, gigSlug, image) {
        try {
            const gig = await Gig.findOne({ attributes: ['id', 'sellerId', 'image'], where: { slug: gigSlug } });
            if (!gig) throw new ApiError(404, `Gig '${gigSlug}' was not found`);
            if (gig.sellerId !== authUser.id)
                throw new ApiError(401, `You do not have permission to perform this action`);

            if (gig.image) {
                const decodedUrl = decodeURI(gig.image);
                const imageFileName = decodedUrl.split('/').slice(-3).join('/').replace('.jpg', '');

                await cloudinary.uploader.destroy(imageFileName);
            }

            const gigImage = await gig.update({ image });
            return gigImage;
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/v1/gigs/:gigSlug/edit
    async editGig(authUser, gigSlug, formData) {
        try {
            const { gigServiceId, gigSubCategoryId, gigCategoryId, ...gigData } = formData;

            const gig = await Gig.findOne({ attributes: ['id', 'sellerId'], where: { slug: gigSlug } });
            if (!gig) throw new ApiError(404, `Gig ${gigSlug} was not found`);
            if (authUser.role !== 'admin' && gig.sellerId !== authUser.id)
                throw new ApiError(401, `You do not have permission to perform this action!`);

            const gigCategory = await GigCategory.findByPk(gigCategoryId, { attributes: ['id', 'name'] });
            if (!gigCategory) throw new ApiError(404, `Gig category '${gigCategoryId}' was not found`);

            const gigSubCategory = await GigSubCategory.findAll({
                attributes: ['id', 'name'],
                where: { id: gigSubCategoryId, gigCategoryId },
                limit: 1,
            });
            if (!gigSubCategory[0]) {
                throw new ApiError(
                    406,
                    `Gig sub_category '${gigSubCategoryId}' was not found or not in Category ${gigCategoryId}`,
                );
            }

            const gigService = await GigService.findAll({
                attributes: ['id', 'name'],
                where: { id: gigServiceId, gigSubCategoryId },
                limit: 1,
            });
            if (!gigService[0]) {
                throw new ApiError(
                    406,
                    `Gig service '${gigServiceId}' was not found or not in Sub_category ${gigSubCategoryId}`,
                );
            }

            await gig.update({
                ...gigData,
                gigServiceId,
            });

            return gig;
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/v1/gigs/:gigSlug/delete
    async deleteGig(authUser, gigSlug, formData) {
        try {
            const { confirmPassword } = formData;
            const [user, gig] = await Promise.all([
                User.findByPk(authUser.id, { attributes: ['id', 'password'] }),
                Gig.findOne({ attributes: ['id', 'sellerId'], where: { slug: gigSlug } }),
            ]);

            if (!gig) throw new ApiError(404, `Gig '${gigSlug}' was not found`);

            if (authUser.role !== 'admin' && gig.sellerId !== authUser.id)
                throw new ApiError(401, `You do not have permission to perform this action`);

            if (user.comparePassword(confirmPassword)) {
                await gig.destroy({ force: true });
            } else {
                throw new ApiError(406, 'Wrong password');
            }
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new GigsService();
