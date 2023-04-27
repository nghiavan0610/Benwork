'use strict';
const { Model } = require('sequelize');
const SequelizeSlugify = require('sequelize-slugify');
module.exports = (sequelize, DataTypes) => {
    class GigSubCategory extends Model {
        static associate(models) {
            GigSubCategory.hasMany(models.GigService, {
                sourceKey: 'id',
                foreignKey: 'gigSubCategoryId',
            });
            GigSubCategory.belongsTo(models.GigCategory, { foreignKey: 'gigCategoryId' });
        }
    }
    GigSubCategory.init(
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
                        msg: 'Please enter the gig sub-category name',
                    },
                },
            },
            gigCategoryId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'GigCategory',
                    key: 'id',
                },
            },
            slug: {
                type: DataTypes.STRING,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: 'GigSubCategory',
            timestamps: true,
        },
    );
    // Add plugins
    SequelizeSlugify.slugifyModel(GigSubCategory, {
        source: ['name'],
        incrementalSeparator: '-',
        overwrite: true,
        column: 'slug',
        bulkUpdate: true,
    });
    return GigSubCategory;
};
