const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Book extends Model {}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: -1,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'book',
  }
)

module.exports = Book
