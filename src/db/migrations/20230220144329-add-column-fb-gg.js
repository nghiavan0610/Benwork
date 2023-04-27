'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await Promise.all([
                queryInterface.addColumn(
                    'Users',
                    'facebookId',
                    {
                        type: Sequelize.STRING,
                    },
                    { transaction },
                ),
                queryInterface.addColumn(
                    'Users',
                    'googleId',
                    {
                        type: Sequelize.STRING,
                    },
                    { transaction },
                ),
            ]);
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
        }
    },
    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await Promise.all([
                queryInterface.removeColumn('Users', 'facebookId', { transaction }),
                queryInterface.removeColumn('Users', 'googleId', { transaction }),
            ]);
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
        }
    },
};
