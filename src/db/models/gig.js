'use strict';
const { Model } = require('sequelize');
const SequelizeSlugify = require('sequelize-slugify');
const { ValidationError } = require('../../helpers/ErrorHandler');

module.exports = (sequelize, DataTypes) => {
    class Gig extends Model {
        static associate(models) {
            Gig.belongsTo(models.User, { as: 'GigOwner', foreignKey: 'sellerId' });
            Gig.belongsTo(models.GigService, { foreignKey: 'gigServiceId' });
            Gig.hasMany(models.Order, {
                as: 'GigIsOrderedBy',
                sourceKey: 'id',
                foreignKey: 'gigId',
                onDelete: 'CASCADE',
                hooks: true,
            });
            Gig.belongsToMany(models.List, {
                as: 'GigsIsCollectedBy',
                through: {
                    model: models.Collection,
                    unique: false,
                    scope: {
                        tagType: 'Gig',
                    },
                },
                foreignKey: 'tagId',
                constraints: false,
                onDelete: 'CASCADE',
                hooks: true,
            });

            Gig.hasMany(models.Review, {
                as: 'ReviewBody',
                foreignKey: 'tagId',
                scope: {
                    tagType: 'Gig',
                },
                constraints: false,
                onDelete: 'CASCADE',
                hooks: true,
            });
        }
    }
    Gig.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {
                        msg: 'Please enter your gig name',
                    },
                },
            },
            image: DataTypes.STRING,
            description: DataTypes.STRING,
            basicPrice: {
                type: DataTypes.FLOAT,
                defaultValue: 0,
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('basicPrice', 0);
                    } else {
                        if (!parseFloat(value)) {
                            throw new ValidationError(400, 'Wrong price format');
                        }
                        this.setDataValue('basicPrice', parseFloat(value));
                    }
                },
            },
            basicAbout: DataTypes.STRING,
            standardPrice: {
                type: DataTypes.FLOAT,
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('standardPrice', null);
                    } else {
                        if (!parseFloat(value)) {
                            throw new ValidationError(400, 'Wrong price format');
                        }
                        this.setDataValue('standardPrice', parseFloat(value));
                    }
                },
            },
            standardAbout: DataTypes.STRING,
            premiumPrice: {
                type: DataTypes.FLOAT,
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('premiumPrice', null);
                    } else {
                        if (!parseFloat(value)) {
                            throw new ValidationError(400, 'Wrong price format');
                        }
                        this.setDataValue('premiumPrice', parseFloat(value));
                    }
                },
            },
            premiumAbout: DataTypes.STRING,
            sellerId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'id',
                },
            },
            gigServiceId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'GigService',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                hooks: true,
            },
            slug: {
                type: DataTypes.STRING,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: 'Gig',
            timestamps: true,
            paranoid: true,
        },
    );
    // Add plugins
    SequelizeSlugify.slugifyModel(Gig, {
        source: ['name'],
        incrementalSeparator: '-',
        overwrite: true,
        column: 'slug',
        bulkUpdate: true,
    });

    return Gig;
};
