'use strict';
const { Model } = require('sequelize');
const SequelizeSlugify = require('sequelize-slugify');
module.exports = (sequelize, DataTypes) => {
    class GigService extends Model {
        static associate(models) {
            GigService.hasMany(models.Gig, {
                sourceKey: 'id',
                foreignKey: 'gigServiceId',
            });
            GigService.belongsTo(models.GigSubCategory, { foreignKey: 'gigSubCategoryId' });
        }
    }
    GigService.init(
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
                        msg: 'Please enter the gig service name',
                    },
                },
            },
            gigSubCategoryId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'GigSubCategory',
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
            modelName: 'GigService',
            timestamps: true,
        },
    );
    // Add plugins
    SequelizeSlugify.slugifyModel(GigService, {
        source: ['name'],
        incrementalSeparator: '-',
        overwrite: true,
        column: 'slug',
        bulkUpdate: true,
    });
    return GigService;
};
