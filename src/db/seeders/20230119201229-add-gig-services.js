'use strict';
const GigServices = require('../devData/GigServices.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const data = GigServices;

        await queryInterface.bulkInsert('GigServices', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('GigServices', null, {});
    },
};
