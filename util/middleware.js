const logger = require('./logger')

const unknownRoute = (request, response, next) => {
  response.status(404).json({error: 'Resource not found'})
}

const error = (request, response, next) => {
  response.status(400).json({error: 'Error with resource'})
}

module.exports = {
    unknownRoute,
    error
}
