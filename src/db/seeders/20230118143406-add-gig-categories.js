'use strict';
const GigCategories = require('../devData/GigCategories.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const data = GigCategories;
        await queryInterface.bulkInsert('GigCategories', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('GigCategories', null, {});
    },
};
