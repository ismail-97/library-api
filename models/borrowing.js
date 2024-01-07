const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Borrowing extends Model {}

Borrowing.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    bookId: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      references: { model: 'books', key: 'id' },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'borrowing',
  }
)

module.exports = Borrowing