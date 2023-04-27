'use strict';
const GigCategories = require('../mockData/gig_categories_mock_data');
const GigSubCategories = require('../mockData/gig_sub_categories_mock_data');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        let GigCategoryID = [];
        GigCategories.forEach((el) => {
            GigCategoryID.push(el.id);
        });

        const data = GigSubCategories.map((v) => ({
            ...v,
            gigCategoryId: GigCategoryID[(Math.random() * GigCategoryID.length) | 0],
        }));
        await queryInterface.bulkInsert('GigSubCategories', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('GigSubCategories', null, {});
    },
};
