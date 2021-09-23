const Envelope = require('../models/envelope')
const { sampleUsers } = require('./user-helper')
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

const envelopesInDb = async () => {
  const envelopes = await Envelope.find()
  return envelopes.map(envelope => envelope.toJSON())
}

const getFirstEnvelopeInDb = async () => {
  const envelopes = await envelopesInDb()
  return envelopes[0]
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

module.exports = {
  sampleEnvelopes,
  envelopesInDb,
  getFirstEnvelopeInDb,
  getNonExsistentId
}
