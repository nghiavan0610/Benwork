'use strict';
const Lists = require('../devData/Lists.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const data = Lists;
        await queryInterface.bulkInsert('Lists', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Lists', null, {});
    },
};
