/* eslint-disable no-useless-catch */
const Envelope = require('../models/envelope')
const InsufficientFunds = require('../Errors/InsufficientFunds')

async function getAllEnvelopes () {
  try {
    const allEnvelopes = await Envelope.find()
      .populate('user', { username: 1, email: 1 })
    return allEnvelopes
  } catch (error) {
    throw error
  }
}

async function addEnvelope (envelope) {
  const envelopeObject = new Envelope(envelope)

  try {
    const response = await envelopeObject.save()
    return response.toJSON()
  } catch (error) {
    throw error
  }
}

async function removeEnvelope (envelope) {
  try {
    await Envelope.deleteOne({ id: envelope.id })
  } catch (error) {
    throw error
  }
}

async function updateEnvelope (envelope, amount) {
  envelope.amount += amount
  try {
    const response = await envelope.save()

    return response.toJSON()
  } catch (error) {
    throw error
  }
}

async function findEnvelope (envelopeId) {
  try {
    const envelope = await Envelope.findById(envelopeId)

    return envelope
  } catch (error) {
    throw error
  }
}

async function transferFunds (sourceEnvelope, destinationEnvelope, amount) {
  if (sourceEnvelope.amount >= amount) {
    sourceEnvelope.amount -= amount
    destinationEnvelope.amount += amount

    await sourceEnvelope.save()
    await destinationEnvelope.save()
  } else {
    throw new InsufficientFunds('Not enough funds in source envelope')
  }

  return undefined
}

module.exports = {
  getAllEnvelopes,
  addEnvelope,
  updateEnvelope,
  transferFunds,
  findEnvelope,
  removeEnvelope
}
