const { User, Book } = require('../models')

const checkExistense = async (req, res, next) => {
  const { userId, bookId } = req.params

  const user = await User.findByPk(userId)
  if (!user) {
    return res.status(401).json({ error: 'no user with the provided id' })
  }

  const book = await Book.findByPk(bookId)
  if (!book) {
    return res.status(401).json({ error: 'no book with the provided id' })
  }

  next()
}

module.exports = checkExistense
