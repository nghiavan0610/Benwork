'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserLanguage extends Model {
        static associate(models) {
            UserLanguage.belongsTo(models.User, { foreignKey: 'userId' });
            UserLanguage.belongsTo(models.Language, { foreignKey: 'languageId' });
        }
    }
    UserLanguage.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'id',
                },
            },
            languageId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Language',
                    key: 'id',
                },
            },
            level: {
                type: DataTypes.ENUM('basic', 'conversational', 'fluent', 'native'),
                defaultValue: 'basic',
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('level', 'basic');
                    } else {
                        this.setDataValue('level', value);
                    }
                },
            },
        },
        {
            sequelize,
            modelName: 'UserLanguage',
            timestamps: true,
        },
    );
    return UserLanguage;
};
