const router = require('express').Router()
const validate = require('../middlewares/validate')
const createSchema = require('../bodyValidators/createSchema')
const { User, Book } = require('../models')

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['id'] } })
    res.json(users)
  } catch (error) {
    res
      .status(401)
      .json({ error: `${error} happened while retrieving all users` })
  }
})

router.get('/:id', async (req, res) => {
  try {
    let user = await User.findByPk(req.params.id, {
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: Book,
          as: 'present',
          attributes: { exclude: ['id', 'score'] },
          through: {
            attributes: [],
          },
        },
        {
          model: Book,
          as: 'past',
          attributes: { exclude: ['id'] },
          through: {
            attributes: [],
          },
        },
      ],
    })
    const books = { past: user.past, present: user.present }
    user = { id: user.id, name: user.name, books }
    res.json(user)
  } catch (error) {
    res
      .status(401)
      .json({ error: `${error} -> there may not be a user with this id` })
  }
})

router.post('/', createSchema, validate, async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.status(201).end()
  } catch (error) {
    return res.status(401).json({ error: error.message })
  }
})

module.exports = router
