'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User, {
                as: 'OrderOwner',
                foreignKey: 'userId',
            });
            Order.belongsTo(models.Gig, {
                as: 'GigIsOrdered',
                foreignKey: 'gigId',
            });
        }
    }
    Order.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'id',
                },
            },
            gigId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                references: {
                    model: 'Gig',
                    key: 'id',
                },
            },
            package: {
                type: DataTypes.ENUM('basic', 'standard', 'premium'),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [['basic', 'standard', 'premium']],
                        msg: 'Unknown package type',
                    },
                },
            },
            quantity: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('quantity', 1);
                    } else {
                        this.setDataValue('quantity', value);
                    }
                },
            },
            total: {
                type: DataTypes.FLOAT,
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('total', null);
                    } else {
                        if (!parseFloat(value)) {
                            throw new ValidationError(400, 'Wrong price format');
                        }
                        this.setDataValue('total', parseFloat(value));
                    }
                },
            },
            isDone: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                set(value) {
                    if (!value || value === 'null') {
                        this.setDataValue('isDone', false);
                    } else {
                        this.setDataValue('isDone', value);
                    }
                },
            },
        },
        {
            sequelize,
            modelName: 'Order',
            timestamps: true,
            createdAt: 'orderDate',
        },
    );
    return Order;
};
