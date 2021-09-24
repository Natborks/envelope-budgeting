const User = require('../models/user')
const authUtils = require('../util/auth')

const sampleUsers = [
  {
    username: 'root',
    email: 'root@email.com',
    passwordHash: 'sekret'
  },
  {
    username: 'james',
    email: 'james@email.com',
    passwordHash: 'sekret'
  },
  {
    username: 'hash',
    email: 'hash@email.com',
    password: '1234'
  }
]
const createSampleUsers = async () => {
  const secretPassword = await authUtils.createPasswordHash('sekret')

  sampleUsers[0].passwordHash = secretPassword
  let user = new User(sampleUsers[0])

  await user.save()

  sampleUsers[1].passwordHash = secretPassword
  user = new User(sampleUsers[1])

  await user.save()
}

const removeAllUsersFromDb = async () => {
  await User.deleteMany()
}

const getUsersInDb = async () => {
  const response = await User.find()

  const usersInDb = response.map(user => user.toJSON())

  return usersInDb
}

const getSampleUser = async () => {
  const user = new User({
    username: 'gh',
    email: 'gh@email.com',
    passwordHash: 1235
  })

  const response = await user.save()

  return response.toJSON()
}

const getSampleUserRawResponse = async (userId) => {
  const rawResponse = await User.findById(userId)

  return rawResponse
}

const getUnsavedUser = () => {
  return sampleUsers[2]
}

const getNonExsistentId = async () => {
  const hashedPassword = await authUtils.createPasswordHash('sekret')
  const user = new User({
    username: 'toBeDeleted',
    email: 'toBeDeleted@email.com',
    passwordHash: hashedPassword
  })

  const toBeRemoved = await user.save()
  await toBeRemoved.remove()

  return toBeRemoved.id
}

module.exports = {
  sampleUsers,
  getUsersInDb,
  createSampleUsers,
  removeAllUsersFromDb,
  getSampleUser,
  getUnsavedUser,
  getSampleUserRawResponse,
  getNonExsistentId
}
