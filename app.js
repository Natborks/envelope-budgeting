const express = require('express')
const requestInfologger = require('morgan')
const logger = require('./util/logger')
const middlerware = require('./util/middleware')
const mongoose = require('mongoose')
const config = require('./util/config')
const cors = require('cors')

const envelopeRouter = require('./controllers/envelope')

const app = express()

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to db @:', config.MONGODB_URI)
  })
  .catch(error => {
    logger.error(error.message)
  })

app.use(requestInfologger('dev'))
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))

app.use('/api/envelopes', envelopeRouter)

// catch 404 and forward to error handler
app.use(middlerware.unknownRoute)

// error handler
app.use(middlerware.errorHandler)

app.listen(config.PORT, () => {
  logger.info(`listening on port ${config.PORT}`)
})
module.exports = app
