const express = require('express')
const router = express()
const envelopeRepository = require('../models/envelopeRepository')

router.param('envelopeId', async (req, res, next, params) => {
  try {
    const envelope = await envelopeRepository.findEnvelope(params)
    if (envelope) {
      req.envelope = envelope
      next()
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

router.param('from', async (req, res, next, params) => {
  try {
    const envelope = await envelopeRepository.findEnvelope(params)
    if (envelope) {
      req.fromEnvelope = envelope
      next()
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

router.param('to', async (req, res, next, params) => {
  try {
    const envelope = await envelopeRepository.findEnvelope(params)
    if (envelope) {
      req.toEnvelope = envelope
      next()
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const allEnvelopes = await envelopeRepository.getAllEnvelopes()

    res.send(allEnvelopes)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const envelope = await envelopeRepository.addEnvelope(req.body)

    res.status(201).send(envelope)
  } catch (error) {
    next(error)
  }
})

router.post('/transfer/:from/:to', async (req, res, next) => {
  const fromEnvelope = req.fromEnvelope
  const toEnvelope = req.toEnvelope
  const amount = req.body.amount

  try {
    await envelopeRepository.transferFunds(fromEnvelope, toEnvelope, amount)
    res.send()
  } catch (error) {
    next(error)
  }
})

router.put('/:envelopeId', async (req, res, next) => {
  const requestEnvelope = req.envelope
  const amount = req.body.amount
  try {
    const envelope = await envelopeRepository.updateEnvelope(requestEnvelope, amount)

    res.status(200).json(envelope)
  } catch (error) {
    next(error)
  }
})

router.delete('/:envelopeId', async (req, res, next) => {
  const requestEnvelope = req.envelope
  try {
    await envelopeRepository.removeEnvelope(requestEnvelope)

    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router
