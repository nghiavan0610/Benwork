'use strict';
const { Model } = require('sequelize');
const { ValidationError } = require('../../helpers/ErrorHandler');
module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        static associate(models) {
            Review.belongsTo(models.User, { as: 'ReviewOwner', foreignKey: 'userId' });
            Review.belongsTo(models.Gig, { as: 'ReviewGig', foreignKey: 'tagId' });
            Review.belongsTo(models.User, { as: 'ReviewSeller', foreignKey: 'tagId' });
        }
    }
    Review.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                references: {
                    model: 'User',
                    key: 'id',
                },
            },
            tagId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
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
            content: DataTypes.STRING,
            rating: {
                type: DataTypes.INTEGER,
                set(value) {
                    if (!value || value === 'null') {
                        throw new ValidationError(400, 'Please rate 1 to 5 stars according to your opinion');
                    } else {
                        if (parseInt(value) < 1 || parseInt(value) > 5) {
                            throw new ValidationError(400, 'Rating must be between 1 and 5');
                        }

                        this.setDataValue('rating', value);
                    }
                },
            },
        },
        {
            sequelize,
            modelName: 'Review',
            timestamps: true,
            createdAt: 'reviewDate',
            indexes: [
                {
                    name: 'ix_reviews',
                    fields: ['tagId', 'tagType'],
                    where: { tagType: 'Gig' || 'Seller' },
                },
            ],
        },
    );
    return Review;
};
