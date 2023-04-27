'use strict';
const { Model } = require('sequelize');
const SequelizeSlugify = require('sequelize-slugify');
module.exports = (sequelize, DataTypes) => {
    class GigCategory extends Model {
        static associate(models) {
            GigCategory.hasMany(models.GigSubCategory, {
                sourceKey: 'id',
                foreignKey: 'gigCategoryId',
            });
        }
    }
    GigCategory.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'Please enter the gig category name',
                    },
                },
            },
            slug: {
                type: DataTypes.STRING,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: 'GigCategory',
            timestamps: true,
        },
    );

    // Add plugins
    SequelizeSlugify.slugifyModel(GigCategory, {
        source: ['name'],
        incrementalSeparator: '-',
        overwrite: true,
        column: 'slug',
        bulkUpdate: true,
    });
    return GigCategory;
};
