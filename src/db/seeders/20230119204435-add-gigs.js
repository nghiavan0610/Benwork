'use strict';
const crypto = require('crypto');
const Gigs = require('../devData/Gigs.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // let GigServiceID = [];
        // GigServices.forEach((el) => {
        //     GigServiceID.push(el.id);
        // });

        // const usersID = await queryInterface.sequelize.query(`SELECT id from Users where role = "seller";`);
        // const UserID = usersID[0];
        // const data = Gigs.map((v) => ({
        //     ...v,
        //     id: ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        //         (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
        //     ),
        //     basicPrice: Math.floor(Math.random() * (1000 - 1 + 1) + 1),
        //     standardPrice: Math.floor(Math.random() * (1000 - 1 + 1) + 1),
        //     premiumPrice: Math.floor(Math.random() * (1000 - 1 + 1) + 1),
        //     gigServiceId: GigServiceID[(Math.random() * GigServiceID.length) | 0],
        //     sellerId: UserID[(Math.random() * UserID.length) | 0].id,
        // }));
        const data = Gigs;
        await queryInterface.bulkInsert('Gigs', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Gigs', null, {});
    },
};
