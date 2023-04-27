'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                'GigServices',
                {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    name: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                    createdAt: {
                        allowNull: false,
                        type: Sequelize.DATE,
                    },
                    updatedAt: {
                        allowNull: false,
                        type: Sequelize.DATE,
                    },
                    gigSubCategoryId: {
                        type: Sequelize.INTEGER,
                        references: {
                            model: 'GigSubCategories',
                            key: 'id',
                        },
                        onDelete: 'SET NULL',
                        hooks: true,
                    },
                    slug: {
                        type: Sequelize.STRING,
                        unique: true,
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
            await queryInterface.dropTable('GigServices');
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
        }
    },
};
