const Envelope = require('../models/envelope')
const User = require('../models/user')
const userHelper = require('../util/user-helper')
const sampleEnvelopes = [
  {
    name: 'food',
    amount: 4000
  },
  {
    name: 'fees',
    amount: 30000
  }
]

const createSamplesEnvelopes = async () => {
  await userHelper.createSampleUsers()
  const users = await userHelper.getUsersInDb()
  const user = users[1]

  let envelopeObject = sampleEnvelopes[0]
  envelopeObject.user = user.id
  envelopeObject = new Envelope(envelopeObject)

  await envelopeObject.save()

  envelopeObject = sampleEnvelopes[1]
  envelopeObject = new Envelope(envelopeObject)

  await envelopeObject.save()
}

const getSampleUser = async () => {
  return await userHelper.getSampleUser()
}

const envelopesInDb = async () => {
  const envelopes = await Envelope.find()
  return envelopes.map(envelope => envelope.toJSON())
}

const getFirstEnvelopeInDb = async () => {
  const envelopes = await envelopesInDb()
  return envelopes[0]
}

const removeAllUSersInDb = async () => {
  await userHelper.removeAllUsersFromDb()
}

const getNonExsistentId = async () => {
  const envelope = new Envelope({
    name: 'toBeDeleted',
    amount: 100
  })

  const toBeRemoved = await envelope.save()
  toBeRemoved.remove()

  return toBeRemoved._id.toString()
}

const getNonExsistentUserId = async () => {
  return await userHelper.getNonExsistentId()
}

const findEnvelopeInResults = (envelopeList, envelopeToFind) => {
  return envelopeList.find(envelope => {
    return envelope.name === envelopeToFind.name &&
              envelope.amount === envelopeToFind.amount &&
              envelope.id === envelopeToFind.id
  })
}

module.exports = {
  sampleEnvelopes,
  envelopesInDb,
  getFirstEnvelopeInDb,
  getNonExsistentId,
  createSamplesEnvelopes,
  getSampleUser,
  removeAllUSersInDb,
  getNonExsistentUserId,
  findEnvelopeInResults
}
