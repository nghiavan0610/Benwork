'use strict';
const Countries = require('../devData/Countries.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const data = Countries;
        await queryInterface.bulkInsert('Countries', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Countries', null, {});
    },
};
