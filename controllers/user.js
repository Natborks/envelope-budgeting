const User = require('../models/user')
const userRouter = require('express').Router()
const authUtils = require('../util/auth')

userRouter.param('userId', async (request, response, next, params) => {
  try {
    const user = await User.findById(params)

    if (user) {
      request.user = user
      next()
    } else {
      return response.status(404).json({ error: 'User not found' })
    }
  } catch (error) {
    next(error)
  }
})

userRouter.get('/', async (request, response, next) => {
  const users = await User.find()

  const returnValue = users.map(u => u.toJSON())
  return response.status(200).json(returnValue)
})

userRouter.post('/', async (request, reponse, next) => {
  const body = request.body

  const passwordHash = await authUtils.createPasswordHash(body.password)

  const user = new User({
    username: body.username,
    email: body.email,
    passwordHash
  })

  try {
    const response = await user.save()

    return reponse.status(201).json(response.toJSON())
  } catch (error) {
    next(error)
  }
})

userRouter.get('/:userId', (request, response, next) => {
  const user = request.user

  return response.status(200).json(user.toJSON())
})

module.exports = userRouter
