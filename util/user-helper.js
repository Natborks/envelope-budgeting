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
  const response = await getUsersInDb()
  return response[0]
}

const getSampleUserRawResponse = async (userId) => {
  const rawResponse = await User.findById(userId)

  return rawResponse
}

const getUnsavedUser = () => {
  return sampleUsers[2]
}

module.exports = {
  sampleUsers,
  getUsersInDb,
  createSampleUsers,
  removeAllUsersFromDb,
  getSampleUser,
  getUnsavedUser,
  getSampleUserRawResponse
}
