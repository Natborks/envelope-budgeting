const express = require('express')
const app = require('../app')
const router = express()


router.get('/', (req, res, next) => {
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
