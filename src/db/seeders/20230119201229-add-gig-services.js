'use strict';
const GigServices = require('../mockData/gig_services_mock_data');
const GigSubCategories = require('../mockData/gig_sub_categories_mock_data');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        let GigSubCategoryID = [];
        GigSubCategories.forEach((el) => {
            GigSubCategoryID.push(el.id);
        });

        const data = GigServices.map((v) => ({
            ...v,
            gigSubCategoryId: GigSubCategoryID[(Math.random() * GigSubCategoryID.length) | 0],
        }));
        await queryInterface.bulkInsert('GigServices', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('GigServices', null, {});
    },
};
