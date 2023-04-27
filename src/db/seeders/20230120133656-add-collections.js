'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const listsID = await queryInterface.sequelize.query(`SELECT id from Lists;`);
        const ListID = listsID[0];

        const gigsID = await queryInterface.sequelize.query(`SELECT id from Gigs;`);
        const GigID = gigsID[0];

        const sellersID = await queryInterface.sequelize.query(`SELECT id from Users where role = "seller";`);
        const SellerID = sellersID[0];

        let data = [];
        for (let i = 0; i < 100; i++) {
            if (i < 60) {
                data.push({
                    id: i + 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    listId: ListID[(Math.random() * ListID.length) | 0].id,
                    tagId: GigID[(Math.random() * GigID.length) | 0].id,
                    tagType: 'Gig',
                });
            } else {
                data.push({
                    id: i + 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    listId: ListID[(Math.random() * ListID.length) | 0].id,
                    tagId: SellerID[(Math.random() * SellerID.length) | 0].id,
                    tagType: 'Seller',
                });
            }
        }

        // filter duplicates
        data = data.filter(
            (value, index, self) =>
                index ===
                self.findIndex(
                    (t) =>
                        (t.listId === value.listId && t.tagId === value.tagId && t.tagType === 'Gig') ||
                        (t.listId === value.listId && t.tagId === value.tagId && t.tagType === 'Seller'),
                ),
        );
        await queryInterface.bulkInsert('Collections', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Collections', null, {});
    },
};
