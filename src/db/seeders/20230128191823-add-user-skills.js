'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const usersID = await queryInterface.sequelize.query(`SELECT id from Users;`);
        const UserID = usersID[0];

        const skillsID = await queryInterface.sequelize.query(`SELECT id from Skills;`);
        const SkillID = skillsID[0];

        const leverArr = ['beginner', 'intermediate', 'expert'];

        let data = [];
        for (let i = 0; i < 46; i++) {
            data.push({
                id: i + 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                userId: UserID[(Math.random() * UserID.length) | 0].id,
                skillId: SkillID[(Math.random() * SkillID.length) | 0].id,
                level: leverArr[(Math.random() * leverArr.length) | 0],
            });
        }

        // filter duplicates
        data = data.filter(
            (value, index, self) =>
                index === self.findIndex((t) => t.userId === value.userId && t.skillId === value.skillId),
        );
        await queryInterface.bulkInsert('UserSkills', data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('UserSkills', null, {});
    },
};
