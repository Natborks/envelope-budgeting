const express = require('express')
const app = require('../app')
const router = express()

const {getAllEnvelopes}= require('../util/util')

router.get('/', (req, res, next) => {
    const allEnvelopes  = utils.getAllEnvelopes()

    res.send('hello from the other side')
})

router.post('/', (req, res, next) => {
    res.send('hello from post')
})

router.put('/:envelopeId', (req, res, next) => {
    res.send('hello from put')
})

router.delete('/:envelopeId', (req, res, next) =>{
    res.send('hello from delete')
})

module.exports = router
