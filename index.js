const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const booksRouter = require('./controllers/books')
const usersRouter = require('./controllers/users')
const borrowingsRouter = require('./controllers/borrowings')

app.use(express.json())

app.use('/api/books', booksRouter)
app.use('/api/users', usersRouter)
app.use('/api/users', borrowingsRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
