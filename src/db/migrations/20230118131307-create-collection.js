'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                'Collections',
                {
                    // id: {
                    //     primaryKey: true,
                    //     allowNull: false,
                    //     autoIncrement: true,
                    //     type: Sequelize.INTEGER,
                    // },
                    listId: {
                        type: Sequelize.INTEGER,
                        primaryKey: true,
                        allowNull: false,
                        references: {
                            model: 'Lists',
                            key: 'id',
                        },
                        onDelete: 'CASCADE',
                        hooks: true,
                    },
                    tagId: {
                        type: Sequelize.UUID,
                        defaultValue: Sequelize.UUIDV4,
                        primaryKey: true,
                        allowNull: false,
                        references: null,
                        constraints: false,
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
