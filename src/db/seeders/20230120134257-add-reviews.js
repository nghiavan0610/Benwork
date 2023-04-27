'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const usersID = await queryInterface.sequelize.query(`SELECT id from Users;`);
        const UserID = usersID[0];

        const gigsID = await queryInterface.sequelize.query(`SELECT id from Gigs;`);
        const GigID = gigsID[0];

        const sellersID = await queryInterface.sequelize.query(`SELECT id from Users where role = "seller";`);
        const SellerID = sellersID[0];

        let data = [];
        for (let i = 0; i < 300; i++) {
            if (i < 200) {
                data.push({
                    id: i + 1,
                    reviewDate: new Date(),
                    updatedAt: new Date(),
                    userId: UserID[(Math.random() * UserID.length) | 0].id,
                    tagId: GigID[(Math.random() * GigID.length) | 0].id,
                    content: (Math.random() + 1).toString(36).substring(2),
                    rating: Math.floor(Math.random() * (5 - 1 + 1) + 1),
                    tagType: 'Gig',
                });
            } else {
                data.push({
                    id: i + 1,
                    reviewDate: new Date(),
                    updatedAt: new Date(),
                    userId: UserID[(Math.random() * UserID.length) | 0].id,
                    tagId: SellerID[(Math.random() * SellerID.length) | 0].id,
                    content: (Math.random() + 1).toString(36).substring(2),
                    rating: Math.floor(Math.random() * (5 - 1 + 1) + 1),
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
                        (t.userId === value.userId && t.tagId === value.tagId && t.tagType === 'Gig') ||
                        (t.userId === value.userId && t.tagId === value.tagId && t.tagType === 'Seller'),
                ),
        );
        await queryInterface.bulkInsert('Reviews', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Reviews', null, {});
    },
};
