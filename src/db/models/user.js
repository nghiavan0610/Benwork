'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
const SequelizeSlugify = require('sequelize-slugify');
const { ValidationError } = require('../../helpers/ErrorHandler');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        comparePassword(candidatePassword) {
            return bcrypt.compareSync(candidatePassword, this.password);
        }
        static associate(models) {
            User.hasMany(models.Gig, {
                as: 'Gigs',
                sourceKey: 'id',
                foreignKey: 'sellerId',
                onDelete: 'CASCADE',
                hooks: true,
            });
            User.belongsTo(models.Country, { foreignKey: 'countryId' });
            User.hasMany(models.Order, {
                as: 'Orders',
                sourceKey: 'id',
                foreignKey: 'userId',
                onDelete: 'CASCADE',
                hooks: true,
            });
            User.hasMany(models.List, {
                as: 'Lists',
                sourceKey: 'id',
                foreignKey: 'userId',
                onDelete: 'CASCADE',
                hooks: true,
            });

            User.belongsToMany(models.List, {
                as: 'SellersIsCollectedBy',
                through: {
                    model: models.Collection,
                    unique: false,
                    scope: {
                        tagType: 'Seller',
                    },
                },
                foreignKey: 'tagId',
                constraints: false,
                onDelete: 'CASCADE',
                hooks: true,
            });

            User.hasMany(models.Review, {
                as: 'Reviews',
                sourceKey: 'id',
                foreignKey: 'userId',
                onDelete: 'CASCADE',
                hooks: true,
            });
            User.hasMany(models.Review, {
                as: 'ReviewBody',
                foreignKey: 'tagId',
                scope: {
                    tagType: 'Seller',
                },
                constraints: false,
                onDelete: 'CASCADE',
                hooks: true,
            });
            User.hasMany(models.UserLanguage, {
                sourceKey: 'id',
                foreignKey: 'userId',
                onDelete: 'CASCADE',
                hooks: true,
            });
            User.hasMany(models.UserSkill, {
                sourceKey: 'id',
                foreignKey: 'userId',
                onDelete: 'CASCADE',
                hooks: true,
            });
            User.hasMany(models.UserEducation, {
                sourceKey: 'id',
                foreignKey: 'userId',
                onDelete: 'CASCADE',
                hooks: true,
            });
            User.hasMany(models.UserCertification, {
                sourceKey: 'id',
                foreignKey: 'userId',
                onDelete: 'CASCADE',
                hooks: true,
            });
        }
    }
    User.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'Please enter your username',
                    },
                },
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                validate: {
                    isEmail: {
                        msg: 'Invalid Email Address',
                    },
                },
            },
            password: {
                type: DataTypes.STRING,
                set(value) {
                    if (value.length >= 8 && value.length <= 20) {
                        const salt = bcrypt.genSaltSync(10);
                        const hashedPassword = bcrypt.hashSync(value, salt);
                        this.setDataValue('password', hashedPassword);
                    } else {
                        throw new ValidationError(400, 'Your password should be between 8-20 characters!');
                    }
                },
            },
            birthday: {
                type: DataTypes.DATEONLY,
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('birthday', null);
                    } else {
                        if (!value.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/)) {
                            throw new ValidationError(400, 'Wrong date format');
                        }
                        if (
                            new Date(value).getFullYear() < 1960 ||
                            new Date(value).getFullYear() > new Date().getFullYear()
                        ) {
                            throw new ValidationError(
                                400,
                                'Your birthday cannot be greater than present year and must be greater than 1960',
                            );
                        }

                        this.setDataValue('birthday', value);
                    }
                },
            },
            gender: {
                type: DataTypes.ENUM('none', 'male', 'female', 'other'),
                defaultValue: 'none',
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('gender', 'none');
                    } else {
                        this.setDataValue('gender', value);
                    }
                },
            },
            countryId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Country',
                    key: 'id',
                },
            },
            about: {
                type: DataTypes.STRING,
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('about', null);
                    } else {
                        this.setDataValue('about', value);
                    }
                },
            },
            phone: {
                type: DataTypes.STRING,
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('phone', null);
                    } else {
                        if (!value.match(/^[0-9]+$/)) {
                            throw new ValidationError(400, 'Wrong phone number format');
                        }

                        if (value.length < 9 || value.length > 11) {
                            throw new ValidationError(400, 'Your phone number must between 9 and 11 numbers');
                        }

                        this.setDataValue('phone', value);
                    }
                },
            },
            role: {
                type: DataTypes.ENUM('user', 'seller', 'admin'),
                defaultValue: 'user',
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('role', 'user');
                    } else {
                        this.setDataValue('role', value);
                    }
                },
            },
            avatarUrl: DataTypes.STRING,
            facebookId: DataTypes.STRING,
            googleId: DataTypes.STRING,
            slug: {
                type: DataTypes.STRING,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: 'User',
            defaultScope: {
                attributes: {
                    exclude: ['password'],
                },
            },
            timestamps: true,
            createdAt: 'member_since',
            paranoid: true,
            hooks: {
                afterSave: (record) => {
                    delete record.dataValues.password;
                },
            },
            indexes: [
                {
                    name: 'ix_user_email',
                    unique: true,
                    fields: ['email'],
                },
            ],
        },
    );

    // Add plugins
    SequelizeSlugify.slugifyModel(User, {
        source: ['name'],
        incrementalSeparator: '-',
        overwrite: true,
        column: 'slug',
        bulkUpdate: true,
    });
    return User;
};
