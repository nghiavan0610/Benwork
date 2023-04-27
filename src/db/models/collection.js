'use strict';
const { Model } = require('sequelize');
const { ValidationError } = require('../../helpers/ErrorHandler');

const uppercaseFirst = (str) => `${str[0].toUpperCase()}${str.substr(1)}`;

module.exports = (sequelize, DataTypes) => {
    class Collection extends Model {
        static associate(models) {
            Collection.belongsTo(models.List, { foreignKey: 'listId', constraints: false });
            Collection.belongsTo(models.User, { foreignKey: 'tagId', constraints: false });
            Collection.belongsTo(models.Gig, { foreignKey: 'tagId', constraints: false });
        }
    }
    Collection.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            listId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'List',
                    key: 'id',
                },
            },
            tagId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                references: null,
            },
            tagType: {
                type: DataTypes.ENUM('Gig', 'Seller'),
                validate: {
                    isIn: {
                        args: [['Gig', 'Seller']],
                        msg: 'Unknown item type',
                    },
                },
            },
        },
        {
            sequelize,
            modelName: 'Collection',
            timestamps: true,
            indexes: [
                {
                    name: 'ix_collections',
                    fields: ['tagId', 'tagType'],
                    where: { tagType: 'Gig' || 'Seller' },
                },
            ],
        },
    );
    return Collection;
};
