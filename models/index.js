const User = require('./user')
const Book = require('./book')
const Borrowing = require('./borrowing')
const Borrowed = require('./borrowed')

User.belongsToMany(Book, { through: Borrowing, as: 'present' })
Book.belongsToMany(User, { through: Borrowing })

User.belongsToMany(Book, { through: Borrowed, as: 'past' })
Book.belongsToMany(User, { through: Borrowed })

User.sync({ alter: true })
Book.sync({ alter: true })
Borrowing.sync({ alter: true })
Borrowed.sync({ alter: true })

module.exports = {
  User,
  Book,
  Borrowing,
  Borrowed,
}
