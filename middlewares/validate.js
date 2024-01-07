const { validationResult } = require('express-validator')

const validate = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(401).json({ error: errors.array() })
  }

  next()
}

module.exports = validate
