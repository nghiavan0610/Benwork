'use strict';
const { Model } = require('sequelize');
const SequelizeSlugify = require('sequelize-slugify');
module.exports = (sequelize, DataTypes) => {
    class AcademicTitle extends Model {
        static associate(models) {
            AcademicTitle.hasMany(models.UserEducation, {
                sourceKey: 'id',
                foreignKey: 'titleId',
            });
        }
    }
    AcademicTitle.init(
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
                        msg: 'Please enter the title name',
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
            modelName: 'AcademicTitle',
            timestamps: true,
        },
    );

    // Add plugins
    SequelizeSlugify.slugifyModel(AcademicTitle, {
        source: ['name'],
        incrementalSeparator: '-',
        overwrite: true,
        column: 'slug',
        bulkUpdate: true,
    });
    return AcademicTitle;
};
