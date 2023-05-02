'use strict';
const GigSubCategories = require('../devData/GigSubCategories.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // let GigCategoryID = [];
        // GigCategories.forEach((el) => {
        //     GigCategoryID.push(el.id);
        // });

        // const data = GigSubCategories.map((v) => ({
        //     ...v,
        //     gigCategoryId: GigCategoryID[(Math.random() * GigCategoryID.length) | 0],
        // }));
        const data = GigSubCategories;
        await queryInterface.bulkInsert('GigSubCategories', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('GigSubCategories', null, {});
    },
};
