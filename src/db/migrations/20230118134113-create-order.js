'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Orders', {
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
            gigId: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                references: {
                    model: 'Gigs',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                hooks: true,
            },
            package: {
                type: Sequelize.ENUM('basic', 'standard', 'premium'),
                allowNull: false,
            },
            isDone: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            quantity: {
                type: Sequelize.INTEGER,
            },
            total: {
                type: Sequelize.FLOAT,
            },
            orderDate: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Orders');
    },
};
