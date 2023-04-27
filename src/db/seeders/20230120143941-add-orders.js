'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const usersID = await queryInterface.sequelize.query(`SELECT id from Users;`);
        const UserID = usersID[0];

        const gigsID = await queryInterface.sequelize.query(`SELECT id from Gigs;`);
        const GigID = gigsID[0];

        const packageArr = ['basic', 'standard', 'premium'];

        let data = [];
        for (let i = 0; i < 300; i++) {
            data.push({
                id: i + 1,
                package: packageArr[(Math.random() * packageArr.length) | 0],
                isDone: Math.random() < 0.5,
                quantity: Math.floor(Math.random() * (10 - 1 + 1) + 1),
                total: Math.floor(Math.random() * (1300 - 1 + 1) + 1),
                orderDate: new Date(),
                updatedAt: new Date(),
                userId: UserID[(Math.random() * UserID.length) | 0].id,
                gigId: GigID[(Math.random() * GigID.length) | 0].id,
            });
        }
        await queryInterface.bulkInsert('Orders', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Orders', null, {});
    },
};
