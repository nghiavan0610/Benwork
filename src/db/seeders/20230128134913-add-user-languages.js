'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const usersID = await queryInterface.sequelize.query(`SELECT id from Users;`);
        const UserID = usersID[0];

        const languagesID = await queryInterface.sequelize.query(`SELECT id from Languages;`);
        const LanguageID = languagesID[0];

        const leverArr = ['basic', 'conversational', 'fluent', 'native'];

        let data = [];
        for (let i = 0; i < 46; i++) {
            data.push({
                id: i + 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                userId: UserID[(Math.random() * UserID.length) | 0].id,
                languageId: LanguageID[(Math.random() * LanguageID.length) | 0].id,
                level: leverArr[(Math.random() * leverArr.length) | 0],
            });
        }

        // filter duplicates
        data = data.filter(
            (value, index, self) =>
                index === self.findIndex((t) => t.userId === value.userId && t.languageId === value.languageId),
        );
        await queryInterface.bulkInsert('UserLanguages', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('UserLanguages', null, {});
    },
};
