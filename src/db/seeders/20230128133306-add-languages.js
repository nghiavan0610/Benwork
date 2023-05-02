'use strict';
const Languages = require('../devData/Languages.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const data = Languages;
        await queryInterface.bulkInsert('Languages', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Languages', null, {});
    },
};
