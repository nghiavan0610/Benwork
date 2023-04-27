'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                'UserEducations',
                {
                    id: {
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
                    universityId: {
                        type: Sequelize.INTEGER,
                        references: {
                            model: 'Universities',
                            key: 'id',
                        },
                        onDelete: 'SET NULL',
                        hooks: true,
                    },
                    majorId: {
                        type: Sequelize.INTEGER,
                        references: {
                            model: 'Majors',
                            key: 'id',
                        },
                        onDelete: 'SET NULL',
                        hooks: true,
                    },
                    countryId: {
                        type: Sequelize.INTEGER,
                        references: {
                            model: 'Countries',
                            key: 'id',
                        },
                        onDelete: 'SET NULL',
                        hooks: true,
                    },
                    titleId: {
                        type: Sequelize.INTEGER,
                        references: {
                            model: 'AcademicTitles',
                            key: 'id',
                        },
                        onDelete: 'SET NULL',
                        hooks: true,
                    },
                    yearOfGraduation: {
                        type: Sequelize.INTEGER,
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
            await queryInterface.dropTable('UserEducations');
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
        }
    },
};
