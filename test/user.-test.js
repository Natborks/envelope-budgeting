/* eslint-disable no-undef */
const request = require('supertest')
const { assert } = require('chai')
const app = require('../app')
const mongoose = require('mongoose')
const helper = require('../util/user-helper')
const api = request(app)

beforeEach(async () => {
  await helper.removeAllUsersFromDb()
  await helper.createSampleUsers()
  await helper.getUsersInDb()
})

describe('GET /users', () => {
  it('returns a list of all users', async () => {
    const response = await api
      .get('/api/users')

    assert.equal(response.status, 200)
  })

  it('returns a list of users created users', async () => {
    const users = await helper.getUsersInDb()

    const response = await api
      .get('/api/users')

    assert.equal(response.body.length, users.length)
  })

  it('finds created user in list of created users', async () => {
    const sampleUser = await helper.getSampleUser()

    const reposne = await api
      .get('/api/users')

    assert.deepInclude(reposne.body, sampleUser)
  })
})

describe('POST /users', () => {
  it('returns a 201 status code', async () => {
    const sampleUser = helper.getUnsavedUser()

    const response = await api
      .post('/api/users')
      .send(sampleUser)

    assert.equal(response.status, 201)
  })

  it('returns created user in response', async () => {
    const unsavedUser = helper.getUnsavedUser()

    const response = await api
      .post('/api/users')
      .send(unsavedUser)

    assert.deepEqual(unsavedUser.email, response.body.email)
    assert.deepEqual(unsavedUser.username, response.body.username)
  })

  it('does not create user with duplicate email', async () => {
    const samplerUser = {
      username: 'harsh',
      email: helper.sampleUsers[0].email,
      password: '1234'
    }

    const response = await api
      .post('/api/users')
      .send(samplerUser)

    assert.equal(response.status, 400)
  })

  it('stores user password as a passwordHash', async () => {
    const unsavedUser = helper.getUnsavedUser()

    const response = await api
      .post('/api/users')
      .send(unsavedUser)

    const userResponse = await helper.getSampleUserRawResponse(response.body.id)

    assert.notDeepEqual(userResponse.passwordHash, unsavedUser.passwordHash)
  })
})

describe('/GET /:userId', () => {
  it('finds created user by id', async () => {
    const user = await helper.getSampleUser()

    const response = await api
      .get(`/api/users/${user.id}`)

    assert.equal(response.status, 200)
    assert.deepEqual(response.body, user)
  })
})

after(() => {
  mongoose.connection.close()
})
