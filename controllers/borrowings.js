const router = require('express').Router()
const validate = require('../middlewares/validate')
const checkUserAndBookExistense = require('../middlewares/checkExistense')

const scoreSchema = require('../bodyValidators/scoreSchema')
const { Sequelize } = require('sequelize')
const { User, Book, Borrowing, Borrowed } = require('../models')
const { sequelize } = require('../util/db')

const calculateAndUpdateBookScore = async (bookId) => {
  const avg = await Borrowed.findAll({
    where: { bookId: bookId },
    attributes: [[Sequelize.fn('AVG', sequelize.col('user_score')), 'average']],
    raw: true,
  })

  try {
    await Book.update(
      { score: parseInt(avg[0].average) },
      { where: { id: bookId } }
    )
  } catch (error) {
    return res.status(500).json({ error: error })
  }
}

const handlePastBorrowed = async (score, userId, bookId) => {
  const isPastBorrowed = Borrowed.findOne({
    where: {
      userId: userId,
      bookId: bookId,
    },
  })

  if (isPastBorrowed) {
    try {
      await Borrowed.update(
        { userScore: score },
        { where: { userId: userId, bookId: bookId } }
      )
    } catch (error) {
      return res.status(500).json({ error: error })
    }
  } else {
    const toReturned = await Borrowed.create({
      userId,
      bookId,
      userScore: score,
    })
  }
  calculateAndUpdateBookScore(bookId)
}

// BORROWING A SPECIFIC BOOK
// borrowing a book means adding a new row to 'borrowing' table in database.
// the row should include:
// 1. id of the user who borrrows the book.
// 2. id of the borrowed book.
router.post(
  '/:userId/borrow/:bookId',
  checkUserAndBookExistense,
  async (req, res) => {
    const { userId, bookId } = req.params

    const isBorrowed = await Borrowing.findOne({ where: { bookId: bookId } })
    if (isBorrowed) {
      if (isBorrowed.userId == userId) {
        return res.status(401).json({
          error: 'You Already have this book in your borrowing list',
        })
      } else {
        return res.status(401).json({
          error: 'this book is already borrowed by another user',
        })
      }
    } else {
      const toBorrowed = await Borrowing.create({ userId, bookId })
      res.status(200).json(toBorrowed)
    }
  }
)

// RETURNUNG A SPECIFIC BOOK
// Returning a book means:
// 1. Adding a new row to the (past)'borrowed' table in database.
// 2. Removing it from the (present) 'Borrowing' table.
// the row of 'borrowed' table should include:
// 1. id of the user who borrrows the book.
// 2. id of the borrowed book.
// 3. score of the book given by the user
router.post(
  '/:userId/return/:bookId',
  scoreSchema,
  validate,
  checkUserAndBookExistense,
  async (req, res) => {
    const { userId, bookId } = req.params
    const { score } = req.body

    const isBorrowed = await Borrowing.findOne({ where: { bookId: bookId } })
    if (isBorrowed) {
      if (isBorrowed.userId != userId) {
        return res.status(401).json({
          error: 'This book is borrowed but not by you. you cannot return it',
        })
      }

      await isBorrowed.destroy()
      handlePastBorrowed(score, userId, bookId)
      res.status(200).end()
    } else {
      return res.status(401).json({
        error: 'You cannot return this book, it is not borrowed',
      })
    }
  }
)

module.exports = router
