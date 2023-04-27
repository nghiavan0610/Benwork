'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                'Reviews',
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
                        constraints: false,
                        onDelete: 'CASCADE',
                        hooks: true,
                    },
                    tagId: {
                        type: Sequelize.UUID,
                        defaultValue: Sequelize.UUIDV4,
                        constraints: false,
                        onDelete: 'CASCADE',
                        hooks: true,
                    },
                    tagType: {
                        type: Sequelize.ENUM('Gig', 'Seller'),
                    },
                    content: {
                        type: Sequelize.STRING,
                    },
                    rating: {
                        type: Sequelize.INTEGER,
                    },
                    reviewDate: {
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
            await queryInterface.addIndex(
                'Reviews',
                ['tagId', 'tagType'],
                { name: 'ix_reviews', where: { tagType: 'Gig' || 'Seller' } },
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
            await queryInterface.dropTable('Reviews');
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
        }
    },
};
