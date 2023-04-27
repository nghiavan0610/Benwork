'use strict';
const { Model } = require('sequelize');
const SequelizeSlugify = require('sequelize-slugify');
module.exports = (sequelize, DataTypes) => {
    class Major extends Model {
        static associate(models) {
            Major.hasMany(models.UserEducation, {
                sourceKey: 'id',
                foreignKey: 'majorId',
            });
        }
    }
    Major.init(
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
                        msg: 'Please enter the major name',
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
            modelName: 'Major',
            timestamps: true,
        },
    );

    // Add plugins
    SequelizeSlugify.slugifyModel(Major, {
        source: ['name'],
        incrementalSeparator: '-',
        overwrite: true,
        column: 'slug',
        bulkUpdate: true,
    });
    return Major;
};
