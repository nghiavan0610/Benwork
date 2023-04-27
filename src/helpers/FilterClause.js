const { sequelize } = require('../db/models');
const { Op } = require('sequelize');

const gigFilterClause = (queryData) => {
    const searchQuery = queryData.query;
    const searchCategory = queryData.category;
    const searchSubCategory = queryData.sub_category;
    const searchService = queryData.service;
    const searchLocations = queryData.seller_location ? queryData.seller_location.split(',') : [];
    const searchRangePrice = queryData.gig_range_price ? queryData.gig_range_price.split(',') : [];

    const searchFilter = queryData.filter;

    const page = parseInt(queryData.page) || 1;
    const limit = parseInt(queryData.limit) || 10;
    const offset = (page - 1) * limit;

    const options = {
        where: [],
        order: [[sequelize.literal(`(review_count * review_rating)`), 'DESC']],
        page,
        limit,
        offset,
    };

    if (searchQuery) {
        const searchTerms = searchQuery.split(' ');

        options.where.push({
            [Op.or]: searchTerms.map((term) => {
                return sequelize.literal(`Gig.name LIKE '%${term}%'`);
            }),
        });
    }
    if (searchCategory) {
        options.where.push({
            [Op.and]: { ['$GigService.GigSubCategory.GigCategory.id$']: { [Op.eq]: searchCategory } },
        });
    }
    if (searchSubCategory) {
        options.where.push({
            [Op.and]: { ['$GigService.GigSubCategory.id$']: { [Op.eq]: searchSubCategory } },
        });
    }
    if (searchService) {
        options.where.push({
            [Op.and]: { ['$GigService.id$']: { [Op.eq]: searchService } },
        });
    }
    if (searchLocations.length > 0) {
        options.where.push({
            [Op.and]: { ['$GigOwner.Country.name$']: { [Op.in]: searchLocations } },
        });
    }
    if (searchRangePrice.length > 0) {
        options.where.push({
            [Op.and]: { basicPrice: { [Op.between]: searchRangePrice } },
        });
    }

    if (searchFilter === 'best_selling') {
        options.order.unshift([sequelize.literal('gig_selling_quantity'), 'DESC']);
    }
    if (searchFilter === 'new') {
        options.order.unshift(['createdAt', 'DESC']);
    }

    return options;
};

const userFilterClause = (queryData) => {
    const searchQuery = queryData.query;
    const searchLocations = queryData.seller_location ? queryData.seller_location.split(',') : [];

    const searchFilter = queryData.filter;

    const page = parseInt(queryData.page) || 1;
    const limit = parseInt(queryData.limit) || 10;
    const offset = (page - 1) * limit;

    const options = {
        where: [],
        order: [[sequelize.literal(`(seller_review_rating * seller_review_count)`), 'DESC']],
        page,
        limit,
        offset,
    };

    if (searchQuery) {
        const searchTerms = searchQuery.split(' ');

        options.where.push({
            [Op.or]: searchTerms.map((term) => {
                return sequelize.literal(`User.name LIKE '%${term}%'`);
            }),
        });
    }
    if (searchLocations.length > 0) {
        options.where.push({
            [Op.and]: { ['$Country.name$']: { [Op.in]: searchLocations } },
        });
    }

    if (searchFilter === 'best_selling') {
        options.order.unshift([sequelize.literal('seller_selling_quantity'), 'DESC']);
    }
    if (searchFilter === 'old') {
        options.order.unshift(['member_since', 'ASC']);
    }

    return options;
};

module.exports = { gigFilterClause, userFilterClause };
