'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                'Users',
                {
                    id: {
                        type: Sequelize.UUID,
                        defaultValue: Sequelize.UUIDV4,
                        primaryKey: true,
                    },
                    name: {
                        allowNull: false,
                        type: Sequelize.STRING,
                    },
                    email: {
                        // allowNull: false,
                        type: Sequelize.STRING,
                    },
                    password: {
                        // allowNull: false,
                        type: Sequelize.STRING,
                    },
                    memberSince: {
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
                    birthday: {
                        type: Sequelize.DATEONLY,
                    },
                    gender: {
                        type: Sequelize.ENUM('none', 'male', 'female', 'other'),
                        defaultValue: 'none',
                    },
                    countryId: {
                        type: Sequelize.INTEGER,
                        references: {
                            model: 'Countries',
                            key: 'id',
                        },
                    },
                    about: {
                        type: Sequelize.STRING,
                    },
                    phone: {
                        type: Sequelize.STRING,
                    },
                    role: {
                        type: Sequelize.ENUM('user', 'seller', 'admin'),
                        defaultValue: 'user',
                    },
                    avatarUrl: {
                        type: Sequelize.STRING,
                    },
                    slug: {
                        type: Sequelize.STRING,
                        unique: true,
                    },
                },
                { transaction },
            );
            await queryInterface.addIndex('Users', ['email'], { name: 'ix_user_email', unique: true }, { transaction });
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
        }
    },
    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.dropTable('Users');
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
        }
    },
};
