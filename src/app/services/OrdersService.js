const { ApiError } = require('../../helpers/ErrorHandler');
const { sequelize, User, Gig, List, Order, Collection, Review, Country, Conversation } = require('../../db/models');
const { Op } = require('sequelize');

class OrdersService {
    // [GET] /api/v1/activities/:tagId/reviews
    async getAllReview(tagSlug, tagType) {
        try {
            if (tagType !== 'Gig' && tagType !== 'Seller') {
                throw new ApiError(403, `Unknow tag type item: '${tagType}'`);
            }
            const item =
                tagType === 'Gig'
                    ? await Gig.findOne({
                          attributes: [
                              'id',
                              'name',
                              'image',
                              'slug',
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
                                  'gig_review_count',
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
                                  attributes: ['id', 'name', 'avatarUrl', 'slug'],
                                  model: User,
                                  as: 'GigOwner',
                                  include: {
                                      attributes: ['id', 'name'],
                                      model: Country,
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
                          where: { slug: tagSlug },
                          order: [['ReviewBody', 'reviewDate', 'DESC']],
                      })
                    : await User.findOne({
                          attributes: [
                              'id',
                              'name',
                              'avatarUrl',
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
                          where: { slug: tagSlug },
                          order: [['ReviewBody', 'reviewDate', 'DESC']],
                      });
            if (!item) throw new ApiError(404, `${tagType} '${tagSlug}' was not found`);
            return item;
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/v1/activities/reviews/:reviewId
    async getReviewById(reviewId) {
        try {
            const itemIsReviewed = await Review.findByPk(reviewId, {
                include: [
                    {
                        attributes: ['id', 'name', 'avatarUrl', 'slug'],
                        model: User,
                        as: 'ReviewOwner',
                    },
                    {
                        attributes: ['id', 'name', 'image', 'slug'],
                        model: Gig,
                        as: 'ReviewGig',
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
                        attributes: ['id', 'name', 'avatarUrl', 'slug'],
                        model: User,
                        as: 'ReviewSeller',
                        include: {
                            attributes: ['id', 'name'],
                            model: Country,
                        },
                    },
                ],
            });

            if (!itemIsReviewed) throw new ApiError(404, `Review '${reviewId}' was not found`);

            return itemIsReviewed;
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/v1/activities/:tagSlug/leave-review
    async createReview(id, tagSlug, formData) {
        try {
            const { rating, content, tagType } = formData;

            let item, isOrdered;
            switch (tagType) {
                case 'Gig':
                    [item, isOrdered] = await Promise.all([
                        Gig.findOne({ attributes: ['id'], where: { slug: tagSlug } }),
                        Order.findOne({
                            attributes: ['id'],
                            include: { attributes: ['id'], model: Gig, as: 'GigIsOrdered' },
                            where: { userId: id, isDone: true, [`$GigIsOrdered.slug$`]: tagSlug },
                        }),
                    ]);
                    break;
                case 'Seller':
                    [item, isOrdered] = await Promise.all([
                        User.findOne({ attributes: ['id'], where: { slug: tagSlug, role: 'seller' } }),
                        Order.findOne({
                            attributes: ['id'],
                            include: {
                                attributes: ['id'],
                                model: Gig,
                                as: 'GigIsOrdered',
                                include: { attributes: ['id'], model: User, as: 'GigOwner' },
                            },
                            where: { userId: id, isDone: true, [`$GigIsOrdered.GigOwner.slug$`]: tagSlug },
                        }),
                    ]);
                    break;
                default:
                    throw new ApiError(403, `Unknow tag type item: '${tagType}'`);
            }

            if (!item) throw new ApiError(404, `${tagType} '${tagSlug}' was not found`);

            if (!isOrdered) {
                throw new ApiError(
                    403,
                    tagType === 'Gig'
                        ? `You need to order the gig '${tagSlug}' before you can review on it`
                        : `You need to order at least one gig from the seller '${tagSlug}' before you can review about this seller`,
                );
            }

            const [newReview, created] = await Review.findOrCreate({
                where: { userId: id, tagId: item.id, tagType },
                defaults: { rating, content },
            });
            if (!created) {
                await newReview.update({ rating, content });
            }
            return newReview;
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/v1/activities/reviews/edit
    async editReview(id, formData) {
        try {
            const { reviewId, rating, content } = formData;
            const review = await Review.findOne({ where: { id: reviewId, userId: id } });
            if (!review) {
                throw new ApiError(404, 'This is not your review to edit');
            }

            const newReview = await review.update({ rating, content });
            return newReview;
        } catch (err) {
            throw err;
        }
    }

    // [DELETE] /api/v1/activities/reviews/delete
    async deleteReview(id, reviewId) {
        try {
            const review = await Review.findOne({ where: { id: reviewId, userId: id } });
            if (!review) {
                throw new ApiError(404, 'This is not your review to delete');
            }

            await review.destroy();
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/v1/activities/orders
    async getAllOrders(id) {
        try {
            const user = User.findByPk(id, {
                attributes: [
                    'id',
                    'name',
                    'avatarUrl',
                    'slug',
                    [
                        sequelize.literal(
                            `(select count(*) from Orders where Orders.userId = User.id and Orders.isDone is true)`,
                        ),
                        'total_completed_order',
                    ],
                    [
                        sequelize.literal(
                            `(select count(*) from Orders where Orders.userId = User.id and Orders.isDone is false)`,
                        ),
                        'total_pending_order',
                    ],
                ],
                include: {
                    attributes: ['id', 'package', 'quantity', 'total', 'isDone', 'orderDate'],
                    model: Order,
                    as: 'Orders',
                    include: {
                        attributes: ['id', 'name', 'image', 'slug'],
                        model: Gig,
                        as: 'GigIsOrdered',
                        include: {
                            attributes: ['id', 'name', 'avatarUrl', 'slug'],
                            model: User,
                            as: 'GigOwner',
                        },
                    },
                },
                order: [
                    ['Orders', 'updatedAt', 'DESC'],
                    ['Orders', 'isDone', 'DESC'],
                ],
            });
            return user;
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/v1/v1/activities/orders/:orderId
    async getOrderById(id, orderId) {
        try {
            const order = await Order.findOne({
                attributes: ['id', 'userId', 'package', 'quantity', 'total', 'isDone', 'orderDate'],
                include: {
                    attributes: [
                        'id',
                        'name',
                        'image',
                        'basicPrice',
                        'basicAbout',
                        'standardPrice',
                        'standardAbout',
                        'premiumPrice',
                        'premiumAbout',
                        'slug',
                    ],
                    model: Gig,
                    as: 'GigIsOrdered',
                    include: {
                        attributes: [
                            'id',
                            'name',
                            'email',
                            'phone',
                            'avatarUrl',
                            [
                                sequelize.literal(`(select count(*) from Orders where Orders.gigId = GigIsOrdered.id)`),
                                'gig_selling_quantity',
                            ],
                            [
                                sequelize.literal(
                                    `(select cast(avg(Reviews.rating) AS decimal (10, 2)) from Reviews where Reviews.tagId = GigIsOrdered.id and Reviews.tagType = "Gig")`,
                                ),
                                'review_rating',
                            ],
                            [
                                sequelize.literal(
                                    `(select count(*) from Reviews where Reviews.tagId = GigIsOrdered.id and Reviews.tagType = "Gig")`,
                                ),
                                'review_count',
                            ],
                            'slug',
                        ],
                        model: User,
                        as: 'GigOwner',
                        include: {
                            attributes: ['id', 'name', 'slug'],
                            model: Country,
                        },
                    },
                },
                where: { id: orderId, userId: id },
            });

            if (!order) throw new ApiError(404, `Order '${orderId}' was not found`);
            return order;
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/v1/activities/orders/create
    async createOrder(id, formData) {
        try {
            const { gigId, gigPackage, quantity } = formData;
            if (!['basic', 'standard', 'premium'].includes(gigPackage)) {
                throw new ApiError(403, `Unknow package type: '${gigPackage}'`);
            }
            const gig = await Gig.findByPk(gigId, {
                attributes: ['id', 'basicPrice', 'standardPrice', 'premiumPrice'],
            });
            if (!gig) throw new ApiError(404, `Gig '${gigId}' was not found`);

            if (!gig[`${gigPackage}Price`]) {
                throw new ApiError(404, `Gig '${gigId} do not have a '${gigPackage}' package`);
            }
            const totalPrice = quantity * gig[`${gigPackage}Price`];

            const order = await Order.create({
                userId: id,
                gigId,
                package: gigPackage,
                quantity,
                total: totalPrice,
            });
            return order;
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/v1/activities/orders/complete
    async completeOrder(id, orderId) {
        try {
            const order = await Order.findByPk(orderId);
            if (!order) throw new ApiError(404, `Order '${orderId}' was not found`);
            if (order.userId !== id) throw new ApiError(401, `You do not have permission to perform this action`);
            if (order.isDone) throw new ApiError(409, 'This Order already completed');

            order.isDone = true;
            await order.save();
        } catch (err) {
            throw err;
        }
    }

    // [DELETE] /api/v1/activities/delete-order-history
    async deleteOrderHistory(id, formData) {
        try {
            const { orderId, method } = formData;
            const order = await Order.findByPk(orderId);
            if (!order) throw new ApiError(404, `Order '${orderId}' was not found`);
            if (order.userId !== id) throw new ApiError(401, `You do not have permission to perform this action`);

            switch (method) {
                case 'complete':
                    if (order.isDone) throw new ApiError(409, 'This Order already completed');

                    order.isDone = true;
                    await order.save();
                case 'delete':
                    if (!order.isDone) throw new ApiError(403, 'Cannot delete pending Order');
                    await order.destroy({});
                default:
                    throw new ApiError(405, `Invalid method '${method}`);
            }
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/v1/activities/:userSlug/get-user-deleted-orders
    async getUserDeletedOrder(userSlug) {
        try {
            const deletedOrders = await Order.findAll({
                include: {
                    model: User,
                    as: 'OrderOwner',
                    where: { slug: userSlug },
                },
                where: { deletedAt: { [Op.not]: null } },
                paranoid: false,
            });
            return deletedOrders;
        } catch (err) {
            throw err;
        }
    }

    // [DELETE] /api/v1/activities/force-delete-order-history
    async forceDeleteOrderHistory(orderId) {
        try {
            const deleted = await Order.destroy({
                where: { id: orderId, deletedAt: { [Op.not]: null } },
                force: true,
                paranoid: false,
            });
            if (!deleted) {
                throw new ApiError(404, `Order with id='${orderId}' was not found`);
            }
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/v1/activities/chat
    async createChat(id, recipient_userId) {
        try {
            const recipient = await User.findByPk(recipient_userId);
            if (!recipient) {
                throw new ApiError(404, `User with id='${recipient_userId}' was not found`);
            }

            const [conversation, created] = await Conversation.findOrCreate({
                where: { started_by_userId: id, recipient_userId: recipient.id },
                include: {
                    attributes: ['id', 'name', 'avatarUrl', 'slug'],
                    model: User,
                    as: 'RecipientUser',
                },
                defaults: {},
            });
            return conversation;
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/v1/activities/conversations
    async getAllConversations(id) {
        try {
            const conversations = await Conversation.findAll({
                where: {
                    [Op.or]: [{ started_by_userId: id }, { recipient_userId: id }],
                },
                include: {
                    attributes: ['id', 'name', 'avatarUrl', 'slug'],
                    model: User,
                    as: 'RecipientUser',
                },
                order: [['updatedAt', 'DESC']],
            });
            return conversations;
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/v1/activities/conversations/:conversationId
    async getConversationById(id, conversationId) {
        try {
            const conversation = await Conversation.findOne({
                where: {
                    [Op.or]: [{ started_by_userId: id }, { recipient_userId: id }],
                    [Op.and]: [{ id: conversationId }],
                },
                include: {
                    attributes: ['id', 'name', 'avatarUrl', 'slug'],
                    model: User,
                    as: 'RecipientUser',
                },
                order: [['updatedAt', 'DESC']],
            });
            return conversation;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new OrdersService();
