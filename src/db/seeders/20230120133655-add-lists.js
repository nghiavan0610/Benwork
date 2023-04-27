'use strict';
const Lists = require('../mockData/lists_mock_data');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const usersID = await queryInterface.sequelize.query(`SELECT id from Users;`);
        const UserID = usersID[0];
        const data = Lists.map((v) => ({
            ...v,
            userId: UserID[(Math.random() * UserID.length) | 0].id,
        }));
        await queryInterface.bulkInsert('Lists', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Lists', null, {});
    },
};
