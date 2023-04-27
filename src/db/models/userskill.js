'use strict';
const { Model } = require('sequelize');
const { ValidationError } = require('../../helpers/ErrorHandler');
module.exports = (sequelize, DataTypes) => {
    class UserSkill extends Model {
        static associate(models) {
            UserSkill.belongsTo(models.User, { foreignKey: 'userId' });
            UserSkill.belongsTo(models.Skill, { foreignKey: 'skillId' });
        }
    }
    UserSkill.init(
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
            skillId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Skill',
                    key: 'id',
                },
            },
            level: {
                type: DataTypes.ENUM('beginner', 'intermediate', 'expert'),
                defaultValue: 'beginner',
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('level', 'beginner');
                    } else {
                        this.setDataValue('level', value);
                    }
                },
            },
        },
        {
            sequelize,
            modelName: 'UserSkill',
            timestamps: true,
        },
    );
    return UserSkill;
};
