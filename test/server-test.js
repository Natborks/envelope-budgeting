const {assert} = require('chai')
const request = require('supertest');
const { response } = require('../app');
const app = require('../app')
const {clearAllEnvelopes}= require('../models/envelopeRepository')


describe('envelope', () => {

    beforeEach(() => {
        clearAllEnvelopes()
    })

    describe('GET request', () => {
      it('returns a 200 status', async () => {
        const response = await request(app).
        get('/api/envelopes');

        assert.equal(response.status, 200)
      });
    });

    describe('POST request', () => {

        it('creates a new envelope with the correct request body', async () => {
            const response = await request(app)
            .post('/api/envelopes')
            .send({'name' : 'fees', 'amount' : 1200})

            assert.equal(response.status, 201)
        })

        it('returns newly created envelope', async () => {
            const envelope = {'name' : 'fees', 'amount' : 300}

            const response = await request(app)
            .post('/api/envelopes')
            .send(envelope)

            assert.deepEqual(response.body, envelope)
        })

        it('returns correct reponse for different valid values', async () => {

            const envelope = {'name' : 'food', 'amount' : 500}

            const response = await request(app)
            .post('/api/envelopes')
            .send(envelope)

            assert.deepEqual(response.body, envelope)
        })

        it('saves envelope to envelope collection', async () => {
            const envelope = {'name' : 'food', 'amount' : 500}

            await request(app)
            .post('/api/envelopes')
            .send(envelope)

            const response = await request(app)
            .get('/api/envelopes')

            assert.deepInclude(response.body, envelope)
        })

        it('does not save invalid envelope', async () => {
            const envelope = {'name' : 'food'}

            const response = await request(app)
            .post('/api/envelopes')
            .send(envelope)

            assert.equal(response.status, 400)
        })
    })

    describe('PUT', () => {
        it('returns 200 when for correct request', async () => {
            const envelopeName = 'food'
            const envelope = {'name' : envelopeName, 'amount' : 500}

            await request(app)
            .post('/api/envelopes')
            .send(envelope)

            const response = await request(app)
            .put(`/api/envelopes/${envelopeName}`)
            .send({'amount' : 1000})

            assert.equal(response.status, 200)
        })

        it('returns details of updated envelope', async () => {
            const envelopeName = 'food'
            const expectedResult = {'name' : envelopeName, amount : 2000}
            const envelope = {'name' : envelopeName, 'amount' : 1000}

            await request(app)
            .post('/api/envelopes')
            .send(envelope)

            const response = await request(app)
            .put(`/api/envelopes/${envelopeName}`)
            .send({'amount' : 1000})

            assert.deepEqual(response.body, expectedResult)
        })

        it('return details of updated envelope for different envelope', async () => {

            const envelopeName = 'fees'
            const expectedResult = {'name' : envelopeName, amount : 10500}
            const envelope = {'name' : envelopeName, 'amount' : 500}

            await request(app)
            .post('/api/envelopes')
            .send(envelope)

            const response = await request(app)
            .put(`/api/envelopes/${envelopeName}`)
            .send({'amount' : 10000})

            assert.deepEqual(response.body, expectedResult)
        })

        it('envelope collection constains updated envelope', async () => {

            const envelopeName = 'fees'
            const updatedEnvelope = {'name' : envelopeName, amount : 2}
            const envelope = {'name' : envelopeName, 'amount' : 1}

            await request(app)
            .post('/api/envelopes')
            .send(envelope)

            await request(app)
            .put(`/api/envelopes/${envelopeName}`)
            .send({'amount' : 1})

            const response = await request(app)
            .get('/api/envelopes')

            console.log(response.body)

            assert.deepInclude(response.body, updatedEnvelope)

        })

    })

    describe('DELETE', () => {
        it('returns a status code of 204', async () => {
            const envelopeName = 'fees'
            const envelope = {'name' : envelopeName, 'amount' : 500}

            await request(app)
            .post('/api/envelopes')
            .send(envelope)

            const response = await request(app)
            .delete(`/api/envelopes/${envelopeName}`)

            assert.equal(response.status, 204)
        })

        it('it removes envelope from envelope collection', async () => {
            const envelopeName = 'fees'
            const envelope = {'name' : envelopeName, 'amount' : 500}
            const envelope2 = {'name' : 'another_envlope', 'amount' : 100}

            await request(app)
            .post('/api/envelopes')
            .send(envelope)

            await request(app)
            .post('/api/envelopes')
            .send(envelope2)

            const response = await request(app)
            .delete(`/api/envelopes/${envelopeName}`)

            assert.notDeepInclude(response.body, envelope)

        })

    })


    describe('POST /transfer/:from/:to', () => {
        it('returns a 200 status code if transfer is successful', async () => {
            const fromEnvelopeName = 'fees'
            const toEnvelopeName = 'food'

            const fromEnvelope = {'name' : fromEnvelopeName, 'amount' : 500}
            const toEnvelope = {'name' : toEnvelopeName, 'amount' : 100}

            await request(app)
            .post('/api/envelopes')
            .send(fromEnvelope)

            await request(app)
            .post('/api/envelopes')
            .send(toEnvelope)

            const response = await request(app)
            .post(`/api/envelopes/transfer/${fromEnvelopeName}/${toEnvelopeName}`)
            .send({'amount' : 200})

            assert.equal(response.status, 200)

        })

        it('returns a 404 status if from envelope is not found', async () => {
            const fromEnvelopeName = 'fees'
            const toEnvelopeName = 'food'
            const wrongFromEnvelope = 'fod'

            const fromEnvelope = {'name' : fromEnvelopeName, 'amount' : 500}
            const toEnvelope = {'name' : toEnvelopeName, 'amount' : 100}

            await request(app)
            .post('/api/envelopes')
            .send(fromEnvelope)

            await request(app)
            .post('/api/envelopes')
            .send(toEnvelope)

            const response = await request(app)
            .post(`/api/envelopes/transfer/${wrongFromEnvelope}/${toEnvelopeName}`)
            .send({'amount' : 200})

            assert.equal(response.status, 404)
        })

        it('returns a 404 status if to envelope is not found', async () => {

            const fromEnvelopeName = 'fees'
            const toEnvelopeName = 'food'
            const wrongToEnvelope = 'fes'

            const fromEnvelope = {'name' : fromEnvelopeName, 'amount' : 500}
            const toEnvelope = {'name' : toEnvelopeName, 'amount' : 100}

            await request(app)
            .post('/api/envelopes')
            .send(fromEnvelope)

            await request(app)
            .post('/api/envelopes')
            .send(toEnvelope)

            const response = await request(app)
            .post(`/api/envelopes/transfer/${fromEnvelopeName}/${wrongToEnvelope}`)
            .send({'amount' : 200})

            assert.equal(response.status, 404)
        })

        it('decreases from envelope amount', async () => {
            const fromEnvelopeName = 'fees'
            const toEnvelopeName = 'food'

            const fromEnvelope = {'name' : fromEnvelopeName, 'amount' : 500}
            const toEnvelope = {'name' : toEnvelopeName, 'amount' : 100}
            const expectedResult = [{'name' : fromEnvelopeName, 'amount' : 200}, {'name' : toEnvelopeName, 'amount' : 400}]

            await request(app)
            .post('/api/envelopes')
            .send(fromEnvelope)

            await request(app)
            .post('/api/envelopes')
            .send(toEnvelope)

            const response = await request(app)
            .post(`/api/envelopes/transfer/${fromEnvelopeName}/${toEnvelopeName}`)
            .send({amount : 300})

            assert.deepEqual(response.body, expectedResult)

        })

        it('increases to envelope by amount', async () => {
            const fromEnvelopeName = 'fees'
            const toEnvelopeName = 'food'

            const fromEnvelope = {'name' : fromEnvelopeName, 'amount' : 500}
            const toEnvelope = {'name' : toEnvelopeName, 'amount' : 100}
            const expectedResult = [{'name' : fromEnvelopeName, 'amount' : 200}, {'name' : toEnvelopeName, 'amount' : 400}]

            await request(app)
            .post('/api/envelopes')
            .send(fromEnvelope)

            await request(app)
            .post('/api/envelopes')
            .send(toEnvelope)

            const response = await request(app)
            .post(`/api/envelopes/transfer/${fromEnvelopeName}/${toEnvelopeName}`)
            .send({amount : 300})

            assert.deepEqual(response.body, expectedResult)

        })

        it('transfer is correct for different amounts', async () => {
            const fromEnvelopeName = 'fees'
            const toEnvelopeName = 'food'

            const fromEnvelope = {'name' : fromEnvelopeName, 'amount' : 500}
            const toEnvelope = {'name' : toEnvelopeName, 'amount' : 100}
            const expectedResult = [{'name' : fromEnvelopeName, 'amount' : 400}, {'name' : toEnvelopeName, 'amount' : 200}]

            await request(app)
            .post('/api/envelopes')
            .send(fromEnvelope)

            await request(app)
            .post('/api/envelopes')
            .send(toEnvelope)

            const response = await request(app)
            .post(`/api/envelopes/transfer/${fromEnvelopeName}/${toEnvelopeName}`)
            .send({amount : 100})

            assert.deepEqual(response.body, expectedResult)

        })
    })
  });
