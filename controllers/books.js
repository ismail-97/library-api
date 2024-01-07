const router = require('express').Router()
const validate = require('../middlewares/validate')
const createSchema = require('../bodyValidators/createSchema')
const { Book } = require('../models')

// retrive all books
router.get('/', async (req, res) => {
  const books = await Book.findAll({ attributes: { exclude: ['id', 'score'] } })
  res.json(books)
})

// retrive a specific book
router.get('/:id', async (req, res) => {
  const book = await Book.findByPk(req.params.id)
  if (book) {
    res.json(book)
  } else {
    res.status(404).json({ error: 'No book with the provided id' })
  }
})

// add a new book
router.post('/', createSchema, validate, async (req, res) => {
  try {
    const book = await Book.create(req.body)
    res.json(book)
  } catch (error) {
    return res.status(401).json({ error: error.message })
  }
})

module.exports = router
