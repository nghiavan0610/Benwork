'use strict';
const { Model } = require('sequelize');
const { ValidationError } = require('../../helpers/ErrorHandler');
module.exports = (sequelize, DataTypes) => {
    class UserEducation extends Model {
        static associate(models) {
            UserEducation.belongsTo(models.User, { foreignKey: 'userId' });
            UserEducation.belongsTo(models.University, { foreignKey: 'universityId' });
            UserEducation.belongsTo(models.Major, { foreignKey: 'majorId' });
            UserEducation.belongsTo(models.Country, { foreignKey: 'countryId' });
            UserEducation.belongsTo(models.AcademicTitle, { foreignKey: 'titleId' });
        }
    }
    UserEducation.init(
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
            universityId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'University',
                    key: 'id',
                },
            },
            majorId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Major',
                    key: 'id',
                },
            },
            countryId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Country',
                    key: 'id',
                },
            },
            titleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'AcademicTitle',
                    key: 'id',
                },
            },
            yearOfGraduation: {
                type: DataTypes.INTEGER,
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('yearOfGraduation', null);
                    } else {
                        if (!value.match(/^[0-9]+$/)) {
                            throw new ValidationError(400, 'Wrong year format');
                        }

                        if (value.length !== 4) {
                            throw new ValidationError(400, 'Year of graduation must have 4 characters');
                        }

                        if (value > new Date().getFullYear()) {
                            throw new ValidationError(400, 'Year of graduation cannot be greater than present year');
                        }

                        this.setDataValue('yearOfGraduation', value);
                    }
                },
            },
        },
        {
            sequelize,
            modelName: 'UserEducation',
            timestamps: true,
        },
    );
    return UserEducation;
};
