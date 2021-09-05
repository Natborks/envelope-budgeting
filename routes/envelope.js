const express = require('express')
const app = require('../app')
const router = express()

const {
    getAllEnvelopes,
    addEnvelope,
    findEnvelope,
    updateEnvelope,
    removeEnvelope,
    transferFunds
}= require('../util/util')

router.param('envelopeId', (req, res, next, params) => {

    const envelope = findEnvelope(params)
    if(envelope) {
        req.envelope = envelope
        next()
    } else {
        res.status(404).send('Envelope not found')
    }
})

router.param('from', (req, res, next, params) => {
    const envlope = findEnvelope(params)

    if(envlope){
        req.fromEnvelope = envlope
        next()
    } else {
        res.status(404).send('From envelope not found')
    }
})

router.param('to', (req, res, next, params) => {
    const envelope = findEnvelope(params)

    if(envelope){
        req.toEnvelope = envelope
        next()
    } else {
        res.status(404).send('To envelope not found')
    }
})

router.get('/', (req, res, next) => {
    const allEnvelopes  = getAllEnvelopes()

    res.send(allEnvelopes)
})


router.post('/', (req, res, next) => {
    const envelope = req.body

    const isAddedEnvelope = addEnvelope(envelope)

    if(isAddedEnvelope) {
        res.status(201).send(envelope)
    } else {
        res.status(400).send('Invalid Envelope')
    }

})

router.post('/transfer/:from/:to', (req, res, next) => {
    const fromEnvelope = req.fromEnvelope
    const toEnvelope = req.toEnvelope
    const amount = req.body.amount

    const envelopes = transferFunds(fromEnvelope, toEnvelope, amount)

    res.send(envelopes)
})

router.put('/:envelopeId', (req, res, next) => {
    const requestEnvelope = req.envelope
    const amount = req.body.amount
    const envelope = updateEnvelope(requestEnvelope, amount)

    res.send(envelope)
})

router.delete('/:envelopeId', (req, res, next) =>{
    const requestEnvelope = req.envelope
    const removedItem = removeEnvelope(requestEnvelope)

    if(removedItem) {
        res.status(204).send()
    } else {
        res.status(500).send('Error: Could not remove envelope')
    }

})

module.exports = router
