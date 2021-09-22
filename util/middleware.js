const logger = require('./logger')

const unknownRoute = (request, response, next) => {
  response.status(404).json({ error: 'Resource not found' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(404).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'InsufficientFunds') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  unknownRoute,
  errorHandler
}
