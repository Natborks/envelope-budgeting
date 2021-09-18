const envelopes = []

function getAllEnvelopes() {
    return envelopes
}


function addEnvelope(envelope) {
    const isValidEnvelope = validateEnvelope(envelope)

    if(isValidEnvelope) {
        envelopes.push(envelope)
        return envelope
    } else {
        return false
    }

}

function removeEnvelope(envelope) {
    const pos = envelopes.indexOf(envelope)
    const removedItem = envelopes.splice(pos, 1)

    return removedItem;
}

function clearAllEnvelopes() {
    for(let i = 0; i <= envelopes.length ; i++) {
        envelopes.pop()
    }
}

function updateEnvelope(envelope, amount) {
    if(envelope){
        envelope.amount += amount
        return envelope
    }

    return undefined
}

function findEnvelope(name) {
    return envelopes.find(envelope => name == envelope.name)
}

function transferFunds(source, destination, amount) {
    const sourceEnvelope = findEnvelope(source.name)
    const destinationEnvelope = findEnvelope(destination.name)

    if(sourceEnvelope && destinationEnvelope) {
        if(sourceEnvelope.amount >= amount) {
            sourceEnvelope.amount -= amount
            destinationEnvelope.amount += amount
            return envelopes
        } else {
            throw new Error("Not enough funds in source in source envelope")
        }
    }

    return undefined
}

function validateEnvelope(envelope) {
    const properytiesPresesnt = envelope.hasOwnProperty('name') &&  envelope.hasOwnProperty('amount')
    const isEnvelopePresent = findEnvelope(envelope.name)

    return properytiesPresesnt && !isEnvelopePresent
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
