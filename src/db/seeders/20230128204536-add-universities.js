'use strict';
const Universities = require('../devData/Universities.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const data = Universities;
        await queryInterface.bulkInsert('Universities', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Universities', null, {});
    },
};
