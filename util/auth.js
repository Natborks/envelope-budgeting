const bcrypt = require('bcrypt')
const config = require('./config')

const createPasswordHash = async (password) => {
  return await bcrypt.hash(password, config.SALT_ROUNDS)
}

module.exports = {
  createPasswordHash
}
