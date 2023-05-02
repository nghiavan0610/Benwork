const { ApiError, ValidationError } = require('../../helpers/ErrorHandler');
const {
    sequelize,
    User,
    Gig,
    Review,
    Language,
    Skill,
    UserSkill,
    UserLanguage,
    UserEducation,
    UserCertification,
    University,
    Major,
    Country,
    AcademicTitle,
} = require('../../db/models');
const cloudinary = require('cloudinary').v2;
const { Op } = require('sequelize');
const redisClient = require('../../configs/init.redis');
const { userFilterClause } = require('../../helpers/FilterClause');

class UsersService {
    // [GET] /api/v1/users
    async getAllUsers(queryData) {
        try {
            const { where, order, page, offset, limit } = userFilterClause(queryData);

            const users = await User.findAndCountAll({
                attributes: [
                    'id',
                    'name',
                    'avatarUrl',
                    'role',
                    'memberSince',
                    'slug',
                    [
                        sequelize.literal(
                            `(select count(*) from Orders join Gigs on Orders.gigId = Gigs.id and Gigs.sellerId = User.id)`,
                        ),
                        'seller_selling_quantity',
                    ],
                    [
                        sequelize.literal(`(select count(*) from Gigs where Gigs.sellerId = User.id)`),
                        'seller_total_gig',
                    ],
                    [
                        sequelize.literal(
                            `(select cast(avg(Reviews.rating) AS decimal (10, 2)) from Reviews where Reviews.tagId = User.id and Reviews.tagType = "Seller")`,
                        ),
                        'seller_review_rating',
                    ],
                    [
                        sequelize.literal(
                            `(select count(*) from Reviews where Reviews.tagId = User.id and Reviews.tagType = "Seller")`,
                        ),
                        'seller_review_count',
                    ],
                ],
                include: {
                    attributes: ['id', 'name'],
                    model: Country,
                },
                where,
                order,
                limit,
                offset,
                distinct: true,
                col: 'id',
            });
            if (users.count === 0) {
                throw new ApiError(404, 'No user found for your search');
            }

            const totalPages = Math.ceil(users.count / limit);
            return {
                users: users.rows,
                page,
                totalUsers: users.count,
                totalPages,
            };
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/v1/users/:userSlug
    async getUserBySlug(userSlug) {
        try {
            const user = await User.findOne({
                attributes: [
                    'id',
                    'name',
                    'email',
                    'birthday',
                    'gender',
                    'about',
                    'phone',
                    'role',
                    'avatarUrl',
                    'role',
                    'memberSince',
                    'slug',
                    [
                        sequelize.literal(
                            `(select count(*) from Orders join Gigs on Orders.gigId = Gigs.id join Users on Gigs.sellerId = Users.id and Users.slug = :userSlug)`,
                        ),
                        'seller_selling_quantity',
                    ],
                    [
                        sequelize.literal(`(select count(*) from Gigs where Gigs.sellerId = User.id)`),
                        'seller_total_gig',
                    ],
                    [
                        sequelize.literal(
                            `(select cast(avg(Reviews.rating) AS decimal (10, 2)) from Reviews where Reviews.tagId = User.id and Reviews.tagType = "Seller")`,
                        ),
                        'seller_review_rating',
                    ],
                    [
                        sequelize.literal(
                            `(select count(*) from Reviews where Reviews.tagId = User.id and Reviews.tagType = "Seller")`,
                        ),
                        'seller_review_count',
                    ],
                    [
                        sequelize.literal(
                            `(select count(*) from Reviews where Reviews.tagId = User.id and Reviews.tagType = "Seller" and Reviews.rating = 5)`,
                        ),
                        'seller_review_5_count',
                    ],
                    [
                        sequelize.literal(
                            `(select count(*) from Reviews where Reviews.tagId = User.id and Reviews.tagType = "Seller" and Reviews.rating = 4)`,
                        ),
                        'seller_review_4_count',
                    ],
                    [
                        sequelize.literal(
                            `(select count(*) from Reviews where Reviews.tagId = User.id and Reviews.tagType = "Seller" and Reviews.rating = 3)`,
                        ),
                        'seller_review_3_count',
                    ],
                    [
                        sequelize.literal(
                            `(select count(*) from Reviews where Reviews.tagId = User.id and Reviews.tagType = "Seller" and Reviews.rating = 2)`,
                        ),
                        'seller_review_2_count',
                    ],
                    [
                        sequelize.literal(
                            `(select count(*) from Reviews where Reviews.tagId = User.id and Reviews.tagType = "Seller" and Reviews.rating = 1)`,
                        ),
                        'seller_review_1_count',
                    ],
                ],

                include: [
                    {
                        attributes: ['id', 'name'],
                        model: Country,
                    },
                    {
                        attributes: [
                            'id',
                            'name',
                            'image',
                            'basicPrice',
                            'slug',
                            [
                                sequelize.literal(`(select count(*) from Orders where Orders.gigId = Gigs.id)`),
                                'gig_selling_quantity',
                            ],
                            [
                                sequelize.literal(
                                    `(select cast(avg(Reviews.rating) AS decimal (10, 2)) from Reviews where Reviews.tagId = Gigs.id and Reviews.tagType = "Gig")`,
                                ),
                                'gig_review_rating',
                            ],
                            [
                                sequelize.literal(
                                    `(select count(*) from Reviews where Reviews.tagId = Gigs.id and Reviews.tagType = "Gig")`,
                                ),
                                'gig_review_count',
                            ],
                        ],
                        model: Gig,
                        as: 'Gigs',
                    },
                    {
                        attributes: ['id', 'level'],
                        model: UserLanguage,
                        include: {
                            attributes: ['id', 'name', 'slug'],
                            model: Language,
                        },
                    },
                    {
                        attributes: ['id', 'level'],
                        model: UserSkill,
                        include: {
                            attributes: ['id', 'name', 'slug'],
                            model: Skill,
                        },
                    },
                    {
                        attributes: ['id', 'yearOfGraduation'],
                        model: UserEducation,
                        include: [
                            {
                                attributes: ['id', 'name', 'slug'],
                                model: Country,
                            },
                            {
                                attributes: ['id', 'name', 'slug'],
                                model: University,
                            },
                            {
                                attributes: ['id', 'name', 'slug'],
                                model: Major,
                            },
                            {
                                attributes: ['id', 'name', 'slug'],
                                model: AcademicTitle,
                            },
                        ],
                    },
                    {
                        attributes: ['id', 'name', 'certificatedFrom', 'yearOfCertification', 'slug'],
                        model: UserCertification,
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
                replacements: { userSlug },
                where: { slug: userSlug },
                order: [
                    // [sequelize.literal('(`Gigs.gig_review_count` * `Gigs.gig_review_rating`)'), 'DESC'],
                    [sequelize.literal('`Gigs.gig_selling_quantity`'), 'DESC'],
                    [['ReviewBody', 'reviewDate', 'DESC']],
                ],
            });
            if (!user) {
                throw new ApiError(404, `User '${userSlug}' was not found`);
            }
            return user;
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/v1/users/start-selling
    async startSelling(id, formData) {
        try {
            const { name, about, phone, confirmEmail } = formData;
            const user = await User.findByPk(id, {
                attributes: ['id', 'email', 'avatarUrl', 'role'],
                include: [
                    {
                        attributes: ['id', 'name'],
                        model: Country,
                    },
                    {
                        attributes: ['id', 'level'],
                        model: UserLanguage,
                        include: {
                            attributes: ['id', 'name'],
                            model: Language,
                        },
                    },
                ],
            });

            if (!user.avatarUrl) {
                throw new ApiError(406, 'Please upload your avatar');
            }
            if (!user.Country) {
                throw new ApiError(406, 'Please provide your country');
            }
            if (user.UserLanguages.length <= 0) {
                throw new ApiError(406, 'Please provide at least one language');
            }

            if (user && user.role === 'seller') {
                throw new ApiError(406, 'You are already a seller');
            }

            for (let i in formData) {
                if (!formData[i] || formData[i] === 'null') {
                    throw new ApiError(404, 'Please fill in the mandatory fields');
                }
            }

            if (user.email === confirmEmail) {
                const userOnboarding = await user.update({
                    name,
                    phone,
                    about,
                    role: 'seller',
                });
                return userOnboarding;
            } else {
                throw new ApiError(403, 'Your email does not match with your email profile');
            }
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/v1/users/create
    async createUser(formData) {
        try {
            const { email } = formData;
            const [user, created] = await User.findOrCreate({
                where: { email },
                defaults: formData,
            });

            if (!created) throw new ApiError(409, 'Email already exists');

            return user;
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/v1/users/:userSlug/profile/edit
    async updateUserAccount(userSlug, formData, authUser) {
        try {
            const { role, ...profile } = formData;
            const countryChecked = await Country.findByPk(formData.countryId);
            if (!countryChecked) throw new ApiError(404, 'Country not found');

            let updatedUser;
            // Allow admin to update user account
            // Manager/ User can only update their profile (not include role)
            if (authUser.slug === userSlug) {
                updatedUser = await User.update(profile, { where: { slug: userSlug } });
            } else if (['admin'].includes(authUser.role)) {
                updatedUser = await User.update(formData, { where: { slug: userSlug } });
            } else {
                throw new ApiError(403, 'You do not have permission to perform this action');
            }

            if (!updatedUser[0] && !updatedUser[1][0])
                throw new ApiError(404, `User with slug='${userSlug}' was not found`);

            return updatedUser[1][0];
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new ApiError(409, 'This email already exists');
            }
            throw err;
        }
    }

    // [PUT] /api/v1/users/:userSlug/security/edit
    async updateUserSecurity(userSlug, formData, authUser) {
        try {
            const { oldPassword, newPassword, confirmPassword } = formData;

            const user = await User.findOne({ attributes: ['id', 'password'], where: { slug: userSlug } });
            if (!user) throw new ApiError(404, `User with slug: ${userSlug} was not found`);

            // Allow admin to change user password
            // User can only change their password
            if (!'admin'.includes(authUser.role) && authUser.slug !== userSlug) {
                throw new ApiError(403, 'You do not have permission to perform this action');
            }

            if (authUser.slug === userSlug && !user.comparePassword(oldPassword)) {
                throw new ApiError(403, 'Wrong password');
            }

            if (newPassword !== confirmPassword) {
                throw new ApiError(403, 'Confirm password does not match');
            }

            await user.update({ password: confirmPassword });

            await redisClient.del(`accessToken:${user.id}`);
            await redisClient.del(`refreshToken:${user.id}`);
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/v1/users/deleted_users
    async getDeletedUser() {
        try {
            const deletedUsers = await User.findAll({
                where: { deletedAt: { [Op.not]: null } },
                paranoid: false,
                order: [['deletedAt', 'DESC']],
            });
            return deletedUsers;
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/v1/users/deleted_users/handle-deleted-user
    async handleDeletedUser(id, userSlug, formData) {
        try {
            const { adminPassword, method } = formData;
            const admin = await User.findByPk(id, { attributes: ['id', 'password'] });

            if (admin && admin.comparePassword(adminPassword)) {
                switch (method) {
                    case 'soft':
                        const banned = await User.destroy({ where: { slug: userSlug } });
                        if (!banned) throw new ApiError(404, `User with slug='${userSlug}' was not found`);
                        break;
                    case 'restore':
                        const restoredUser = await User.restore({
                            where: { slug: userSlug, deletedAt: { [Op.not]: null } },
                            paranoid: false,
                        });
                        if (!restoredUser) throw new ApiError(404, `User with slug='${userSlug}' was not found`);
                        break;
                    case 'force':
                        const deleted = await User.destroy({
                            where: { slug: userSlug, deletedAt: { [Op.not]: null } },
                            force: true,
                        });

                        if (!deleted) throw new ApiError(404, `User with slug='${userSlug}' was not found`);

                        await cloudinary.api.delete_resources_by_prefix(`fiverr/${userSlug}/`, async (err, result) => {
                            if (Object.keys(result.deleted).length > 0) {
                                await cloudinary.api.delete_folder(`fiverr/${userSlug}`);
                            }
                        });
                        break;
                    default:
                        throw new ApiError(405, `Invalid method '${method}'`);
                }
            } else {
                throw new ApiError(403, 'Wrong password');
            }
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new UsersService();
