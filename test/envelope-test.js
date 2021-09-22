const {assert} = require('chai')
const request = require('supertest');
const app = require('../app')
const mongoose = require('mongoose')
const {clearAllEnvelopes} = require('../models/envelopeRepository')
const Envelope = require('../models/envelope')
const helper = require('../util/test-helper')


describe('envelope', () => {

    beforeEach(async () => {
        await clearAllEnvelopes()
        await Envelope.deleteMany({})

        let envelopeObject = new Envelope(helper.sampleEnvelopes[0])
        await envelopeObject.save()

        envelopeObject = new Envelope(helper.sampleEnvelopes[1])
        await envelopeObject.save()
    })

    describe('GET request', () => {
      it('returns a 200 status for get all envelopes', async () => {
        const response = await request(app)
          .get('/api/envelopes')

        assert.equal(response.status, 200)
      });

      it('checks correct envelope length', async () => {
        const expectedLength = helper.sampleEnvelopes.length

        const response = await helper.envelopesInDb()

        assert.equal(response.length, expectedLength)
      })
    });

    describe('POST request', () => {

        it('creates a new envelope with the correct request body', async () => {
            const response = await request(app)
            .post('/api/envelopes')
            .send({'name' : 'fees', 'amount' : 1200})

            assert.equal(response.status, 201)
        })

        it('returns newly created envelope', async () => {
            const envelope = {'name' : 'gym', 'amount' : 300}

            await request(app)
            .post('/api/envelopes')
            .send(envelope)

            const content = await helper.envelopesInDb()
            const envelope_names = content.map(envelope => envelope.name)
            assert.deepInclude(envelope_names, envelope.name)
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
            const envelope = await helper.getFirstEnvelopeInDb()

            const response = await request(app)
            .put(`/api/envelopes/${envelope.id}`)
            .send({'amount' : 1000})

            assert.equal(response.status, 200)
        })

        it('returns details of updated envelope', async () => {

            const newAmount = 1000
            const envelope = await helper.getFirstEnvelopeInDb()

            const response = await request(app)
            .put(`/api/envelopes/${envelope.id}`)
            .send({'amount' : newAmount})

            assert.deepEqual(response.body.amount, envelope.amount + newAmount)
        })

        it('envelope collection constains updated envelope', async () => {

            const newAmount  = 1000
            const envelope = await helper.getFirstEnvelopeInDb()

            const response = await request(app)
            .put(`/api/envelopes/${envelope.id}`)
            .send({'amount' : newAmount})

            const updatedEnvelopes = await helper.envelopesInDb()

            assert.deepInclude(updatedEnvelopes, response.body)

        }, 100000)

    })

    describe('DELETE', () => {
        it('returns a status code of 204', async () => {
            const envelope = await helper.getFirstEnvelopeInDb()

            const response = await request(app)
            .delete(`/api/envelopes/${envelope.id}`)

            assert.equal(response.status, 204)
        })

        it('it removes envelope from envelope collection', async () => {
            const envelope = await helper.getFirstEnvelopeInDb()

            const response = await request(app)
            .delete(`/api/envelopes/${envelope.id}`)

            assert.notDeepInclude(response.body, envelope)

        })

    })


    describe('POST /transfer/:from/:to', () => {
        it('returns a 200 status code if transfer is successful', async () => {

            const envelopes = await helper.envelopesInDb()
            const fromEnvelopeName = envelopes[0]
            const toEnvelopeName = envelopes[1]

            const response = await request(app)
            .post(`/api/envelopes/transfer/${fromEnvelopeName.id}/${toEnvelopeName.id}`)
            .send({'amount' : 200})

            assert.equal(response.status, 200)

        })

        it('returns a 404 status if from envelope is not found', async () => {
            const destinationEnvelope = await helper.getFirstEnvelopeInDb()
            const sourceEnvelopeId = await helper.getNonExsistentId()

            const response = await request(app)
            .post(`/api/envelopes/transfer/${sourceEnvelopeId}/${destinationEnvelope.id}`)
            .send({'amount' : 200})

            assert.equal(response.status, 404)
        })

        it('returns a 404 status if to envelope is not found', async () => {

            const fromEnvelope = await helper.getFirstEnvelopeInDb()
            const nonExsitentId = await helper.getNonExsistentId()

            const response = await request(app)
            .post(`/api/envelopes/transfer/${fromEnvelope.id}/${nonExsitentId}`)
            .send({'amount' : 200})

            assert.equal(response.status, 404)
        })

        it('decreases from envelope amount', async () => {
            let envelopes = await helper.envelopesInDb()
            const fromEnvelope = envelopes[0]
            const toEnvelope = envelopes[1]
            const expectedResult = {id: toEnvelope.id, name: toEnvelope.name, amount: toEnvelope.amount += 300}

            const response = await request(app)
            .post(`/api/envelopes/transfer/${fromEnvelope.id}/${toEnvelope.id}`)
            .send({amount : 300})

            envelopes = await helper.envelopesInDb()

            assert.deepInclude(envelopes, expectedResult)

        })

        it('increases to envelope by amount', async () => {
            let envelopes = await helper.envelopesInDb()
            const fromEnvelope = envelopes[0]
            const toEnvelope = envelopes[1]
            const expectedResult = {id: fromEnvelope.id, name: fromEnvelope.name, amount: fromEnvelope.amount -= 300}

            await request(app)
            .post(`/api/envelopes/transfer/${fromEnvelope.id}/${toEnvelope.id}`)
            .send({amount : 300})

            envelopes = await helper.envelopesInDb()

            assert.deepInclude(envelopes, expectedResult)
        })

    })

    after(() => {
        mongoose.connection.close()
    })
});


