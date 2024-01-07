const { body } = require('express-validator')

const scoreSchema = [
  body('score').notEmpty().withMessage('score must not be empty'),
  body('score').isNumeric().withMessage('score must be a number'),
  body('score')
    .isInt({ min: 0, max: 10 })
    .withMessage('score must be between 0 and 10'),
]

module.exports = scoreSchema
