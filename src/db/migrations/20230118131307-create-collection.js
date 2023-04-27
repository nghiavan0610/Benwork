'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                'Collections',
                {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    listId: {
                        type: Sequelize.INTEGER,
                        references: {
                            model: 'Lists',
                            key: 'id',
                        },
                        constraints: false,
                        onDelete: 'CASCADE',
                        hooks: true,
                    },
                    tagId: {
                        type: Sequelize.UUID,
                        defaultValue: Sequelize.UUIDV4,
                        references: null,
                        constraints: false,
                        onDelete: 'CASCADE',
                        hooks: true,
                    },
                    tagType: {
                        type: Sequelize.ENUM('Gig', 'Seller'),
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
            await queryInterface.addIndex(
                'Collections',
                ['tagId', 'tagType'],
                { name: 'ix_collections', where: { tagType: 'Gig' || 'Seller' } },
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
            await queryInterface.dropTable('Collections');
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
        }
    },
};
