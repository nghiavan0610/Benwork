'use strict';
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Users = require('../devData/Users.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // const users = [];

        // const countriesID = await queryInterface.sequelize.query(`SELECT id from Countries;`);
        // const CountryID = countriesID[0];

        // for (let i = 0; i < 25; i++) {
        //     users.push({
        //         id: ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        //             (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
        //         ),
        //         name: i == 0 ? 'admin' : `user${i + 1}`,
        //         email: i == 0 ? 'admin@gmail.com' : `user${i + 1}@gmail.com`,
        //         password: i == 0 ? await bcrypt.hash('p@ssword', 10) : await bcrypt.hash(`user${i + 1}password`, 10),
        //         countryId: CountryID[(Math.random() * CountryID.length) | 0].id,
        //         memberSince: new Date(),
        //         updatedAt: new Date(),
        //         slug: i == 0 ? 'admin' : `user${i + 1}`,
        //         role: i == 0 ? 'admin' : i < 10 ? 'user' : 'seller',
        //     });
        // }
        const data = Users;

        await queryInterface.bulkInsert('Users', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Users', null, {});
    },
};
