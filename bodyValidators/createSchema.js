const { body } = require('express-validator')

const createSchema = [
  body('name').notEmpty().withMessage('name must not be empty'),
  body('name')
    .isLength({ min: 5 })
    .withMessage('name must be longer than 4 letters'),
]

module.exports = createSchema
