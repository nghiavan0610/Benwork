'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                'UserSkills',
                {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    userId: {
                        type: Sequelize.UUID,
                        defaultValue: Sequelize.UUIDV4,
                        references: {
                            model: 'Users',
                            key: 'id',
                        },
                        onDelete: 'CASCADE',
                        hooks: true,
                    },
                    skillId: {
                        type: Sequelize.INTEGER,
                        references: {
                            model: 'Skills',
                            key: 'id',
                        },
                        onDelete: 'CASCADE',
                        hooks: true,
                    },
                    level: {
                        type: Sequelize.ENUM('beginner', 'intermediate', 'expert'),
                        defaultValue: 'beginner',
                    },
                    createdAt: {
                        allowNull: false,
                        type: Sequelize.DATE,
                    },
                    updatedAt: {
                        allowNull: false,
                        type: Sequelize.DATE,
                    },
                },
                { transaction },
            );
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
        }
    },
    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.dropTable('UserSkills');
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
        }
    },
};
