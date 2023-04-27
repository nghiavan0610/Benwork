'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Gigs', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            image: {
                type: Sequelize.STRING,
            },
            description: {
                type: Sequelize.STRING,
            },
            basicPrice: {
                type: Sequelize.FLOAT,
            },
            basicAbout: {
                type: Sequelize.STRING,
            },
            standardPrice: {
                type: Sequelize.FLOAT,
            },
            standardAbout: {
                type: Sequelize.STRING,
            },
            premiumPrice: {
                type: Sequelize.FLOAT,
            },
            premiumAbout: {
                type: Sequelize.STRING,
            },
            sellerId: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                hooks: true,
            },
            gigServiceId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'GigServices',
                    key: 'id',
                },
                onDelete: 'SET NULL',
                hooks: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deletedAt: {
                type: Sequelize.DATE,
            },
            slug: {
                type: Sequelize.STRING,
                unique: true,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Gigs');
    },
};
