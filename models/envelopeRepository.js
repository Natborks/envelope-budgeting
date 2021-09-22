const envelopes = []
const { requestLogger } = require('../../part3-notes-backend/utils/middleware')
const Envelope = require('../models/envelope')
const InsufficientFunds = require('../Errors/InsufficientFunds')
const logger = require('../util/logger')

async function getAllEnvelopes() {
     try {
        const allEnvelopes = await Envelope.find()

        return allEnvelopes
    } catch(error) {
        throw error
    }
}


async function addEnvelope(envelope) {

    const envelopeObject = new Envelope(envelope)

    try {
        const response = await envelopeObject.save()

        return response.toJSON()
    } catch (error) {
       throw error
    }

}

async function removeEnvelope(envelope) {
    try{
        await Envelope.deleteOne({id : envelope.id})
    } catch (error) {
        throw error
    }
}

function clearAllEnvelopes() {
    for(let i = 0; i <= envelopes.length ; i++) {
        envelopes.pop()
    }
}

async function updateEnvelope(envelope, amount) {
    envelope.amount += amount
    try{
        const response = await envelope.save()

        return response.toJSON()
    } catch (error) {
        throw error
    }
}

async function findEnvelope(envelopeId) {
    try {
        const envelope = await Envelope.findById(envelopeId);

        return envelope;
    } catch (error) {
        throw error
    }
}

async function transferFunds(sourceEnvelope, destinationEnvelope, amount) {
    if(sourceEnvelope.amount >= amount) {

        sourceEnvelope.amount -= amount
        destinationEnvelope.amount += amount

        await sourceEnvelope.save()
        await destinationEnvelope.save()
    } else {
        throw new InsufficientFunds("Not enough funds in source envelope")
    }


    return undefined
}

module.exports = {
    getAllEnvelopes,
    addEnvelope,
    clearAllEnvelopes,
    envelopes,
    updateEnvelope,
    transferFunds,
    findEnvelope,
    removeEnvelope
}
