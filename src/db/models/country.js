'use strict';
const { Model } = require('sequelize');
const SequelizeSlugify = require('sequelize-slugify');
module.exports = (sequelize, DataTypes) => {
    class Country extends Model {
        static associate(models) {
            Country.hasMany(models.UserEducation, {
                sourceKey: 'id',
                foreignKey: 'countryId',
            });
            Country.hasMany(models.User, {
                sourceKey: 'id',
                foreignKey: 'countryId',
            });
        }
    }
    Country.init(
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
                        msg: 'Please enter the country name',
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
            modelName: 'Country',
            timestamps: true,
        },
    );

    // Add plugins
    SequelizeSlugify.slugifyModel(Country, {
        source: ['name'],
        incrementalSeparator: '-',
        overwrite: true,
        column: 'slug',
        bulkUpdate: true,
    });
    return Country;
};
