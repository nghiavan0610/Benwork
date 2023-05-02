'use strict';
const Skills = require('../devData/Skills.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const data = Skills;
        await queryInterface.bulkInsert('Skills', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Skills', null, {});
    },
};
