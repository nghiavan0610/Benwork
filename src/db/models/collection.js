'use strict';
const { Model } = require('sequelize');
const { ValidationError } = require('../../helpers/ErrorHandler');
const { options } = require('../../routes/v1');

module.exports = (sequelize, DataTypes) => {
    class Collection extends Model {
        static associate(models) {}
    }
    Collection.init(
        {
            // id: {
            //     type: DataTypes.INTEGER,
            //     primaryKey: true,
            //     autoIncrement: true,
            // },
            listId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                references: {
                    model: 'List',
                    key: 'id',
                },
            },
            tagId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
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
            // indexes: [
            //     {
            //         name: 'ix_collections',
            //         fields: ['tagId', 'tagType'],
            //         where: { tagType: 'Gig' || 'Seller' },
            //     },
            // ],
        },
    );

    return Collection;
};
