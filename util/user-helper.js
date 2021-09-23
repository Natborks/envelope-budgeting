const User = require('../models/user')

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
    passwordHash: '1234'
  }
]
const createSampleUsers = async () => {
  let user = new User(sampleUsers[0])

  await user.save()

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

const getSampleUer = async () => {
  const response = await getUsersInDb()
  return response[0]
}

module.exports = {
  sampleUsers,
  getUsersInDb,
  createSampleUsers,
  removeAllUsersFromDb,
  getSampleUer
}
