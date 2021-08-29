const envelopes = []

function getAllEnvelopes() {
    return envelopes
}


function addEnvelope(envelope) {

    envelopes.push(envelope)
}

function clearAllEnvelopes() {
    for(let i = 0; i <= envelopes.length ; i++) {
        envelopes.pop()
    }
}

function updateEnvelope(name, amount) {
    const envelope = findEnvelope(name)

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
    const sourceEnvelope = findEnvelope(source)
    const destinationEnvelope = findEnvelope(destination)

    if(sourceEnvelope && destinationEnvelope) {
        if(sourceEnvelope.amount >= amount) {
            sourceEnvelope.amount -= amount
            destinationEnvelope.amount += amount
        } else {
            throw new Error("Not enough funds in source in source envelope")
        }
    }

    return undefined
}

module.exports = {
    getAllEnvelopes,
    addEnvelope,
    clearAllEnvelopes,
    envelopes,
    updateEnvelope,
    transferFunds
}
