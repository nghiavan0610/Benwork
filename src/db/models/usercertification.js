'use strict';
const { Model } = require('sequelize');
const SequelizeSlugify = require('sequelize-slugify');
const { ValidationError } = require('../../helpers/ErrorHandler');
module.exports = (sequelize, DataTypes) => {
    class UserCertification extends Model {
        static associate(models) {
            UserCertification.belongsTo(models.User, { foreignKey: 'userId' });
        }
    }
    UserCertification.init(
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
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'Please enter your certification name',
                    },
                },
            },
            certificatedFrom: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'Please enter where your certification from',
                    },
                },
            },
            yearOfCertification: {
                type: DataTypes.INTEGER,
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('yearOfCertification', null);
                    } else {
                        if (!value.match(/^[0-9]+$/)) {
                            throw new ValidationError(400, 'Wrong year format');
                        }

                        if (value.length !== 4) {
                            throw new ValidationError(400, 'Year of certification must have 4 characters');
                        }

                        if (value < 1960 || value > new Date().getFullYear()) {
                            throw new ValidationError(
                                400,
                                'Year of certification cannot be greater than present year and must be greater than 1960',
                            );
                        }

                        this.setDataValue('yearOfCertification', value);
                    }
                },
            },
            slug: {
                type: DataTypes.STRING,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: 'UserCertification',
            timestamps: true,
        },
    );

    // Add plugins
    SequelizeSlugify.slugifyModel(UserCertification, {
        source: ['name'],
        incrementalSeparator: '-',
        overwrite: true,
        column: 'slug',
        bulkUpdate: true,
    });
    return UserCertification;
};
