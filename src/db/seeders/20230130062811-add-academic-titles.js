'use strict';
const AcademicTitles = require('../devData/AcademicTitles.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const data = AcademicTitles;
        await queryInterface.bulkInsert('AcademicTitles', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('AcademicTitles', null, {});
    },
};
