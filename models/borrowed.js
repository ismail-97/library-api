const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Borrowed extends Model {}

Borrowed.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'books', key: 'id' },
    },
    userScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'borrowed',
  }
)

module.exports = Borrowed
